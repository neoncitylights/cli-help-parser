import { doBracketsMatch, sortByLengthDescending } from './utils';

// AST parser tokens
export const TOKEN_SPACE = ' ';
export const TOKEN_OPTION_HYPHEN = '-';
export const TOKEN_OPTION_SEPARATOR = ',';
export const TOKEN_OPTION_BRACKET_OPTIONAL = '[';
export const TOKEN_OPTION_BRACKET_REQUIRED = '<';
export const TOKEN_OPTION_VARIADIC = '...';
export const TOKEN_SUBCOMMAND_SEPARATOR = '|';

// post-processing keywords
const PPROC_KEYWORD_DEPRECATED = 'deprecated';
const PPROC_KEYWORD_FOLDERS = ['folder', 'directory'];
const PPROC_KEYWORD_FILENAME = 'filename';

export class BracketParseError extends Error {}

/**
 * A (non-optimized) option post-processor that uses some basic heuristics to detect
 * any potential useful information about the option from the description:
 *  - Checks if it's deprecated by seeing if the description contains the
 *    `deprecated` keyword.
 *  - Checks if it's a folder option by seeing if the description contains
 *    the `folder` or `directory` keywords.
 */
export function postProcessOption(intlCollator: Intl.Collator, option: Fig.Option): Fig.Option {
	// text
	const text: string = option.description as string;
	const hasArguments: boolean = option.args !== undefined;
	const tokens: string[] = text.split(TOKEN_SPACE);

	// state
	let containsDeprecatedKeyword = false;
	let containsFilenameKeyword = false;
	let containsFolderKeyword = false;

	tokens.forEach((token) => {
		if(!containsDeprecatedKeyword) {
			containsDeprecatedKeyword = intlCollator.compare(token, PPROC_KEYWORD_DEPRECATED) === 0;
		}
		if(!containsFilenameKeyword) {
			containsFilenameKeyword = intlCollator.compare(token, PPROC_KEYWORD_FILENAME) === 0;
		}
		if(!containsFolderKeyword) {
			containsFolderKeyword = PPROC_KEYWORD_FOLDERS.some((keyword) => intlCollator.compare(token, keyword) === 0);
		}
	});

	if(containsDeprecatedKeyword) {
		option.deprecated = true;
	}

	const template: Fig.Template = [];
	if(hasArguments) {
		if(containsFilenameKeyword) { template.push('filepaths'); }
		if(containsFolderKeyword) { template.push('folders'); }

		if (template.length !== 0) {
			(option.args as Fig.Arg).template = template;
		}
	}

	// remove period to conform with ESLint rule
	// `@withfig/fig-linter/conventional-descriptions`
	if(text.endsWith('.')) {
		option.description = text.slice(0, -1);
	}

	return option;
}

export function parseAllOptions(options: string): Fig.Option[] {
	const optionTokens: Fig.Option[] = [];
	const lines: string[] = options.split('\n');
	const intlCollator = new Intl.Collator('en', {
		usage: 'search',
		sensitivity: 'base',
		ignorePunctuation: true,
	});

	lines.forEach((line) => {
		const option: Fig.Option = parseOptionLineToken(line);
		postProcessOption(intlCollator, option);
		optionTokens.push(option);
	});

	return optionTokens;
}

export function parseOptionLineToken(optionLineValue: string): Fig.Option {
	let previousToken: string = optionLineValue[0];
	let consecutiveSpaces = 0;
	let firstCharAfterSpacesIndex = 0;
	let lastCharBeforeSpacesIndex = 0;

	// consume as many whitespace characters as possible
	// to find where the option starts and ends,
	// and where the description starts
	for(let i = 1; i < optionLineValue.length; i++) {
		if(
			optionLineValue[i] == TOKEN_SPACE &&
			previousToken == TOKEN_SPACE
		) {
			consecutiveSpaces++;
			firstCharAfterSpacesIndex = i; 
		}

		previousToken = optionLineValue[i];

		if(
			consecutiveSpaces > 2 &&
			optionLineValue[i] != TOKEN_SPACE
		) {
			lastCharBeforeSpacesIndex = i;
			break;
		}
	}

	const optionToken = parseOptionToken(optionLineValue.slice(0, lastCharBeforeSpacesIndex));
	optionToken.description = optionLineValue.slice(firstCharAfterSpacesIndex + 1);

	return optionToken;
}

/**
 * Parses an option literal like  `-c, --config <value...>` into
 * an abstract token
 */
export function parseOptionToken(optionValue: string): Fig.Option {
	const optionLiteral: string[] =
		optionValue.split(TOKEN_OPTION_SEPARATOR)
			.map((value) => value.trim());

	const option: Fig.Option = {
		name: [],
		description: '',
	};

	const names: string[] = [];
	optionLiteral.forEach((value) => {
		if(value.indexOf(TOKEN_SPACE) != -1) {
			const [name, argumentToken] = value.split(' ');
			names.push(name);
			option.args = parseArgumentToken(argumentToken);
		} else {
			names.push(value);
		}
	});

	if(names.length == 1) {
		option.name = names[0];
	} else {
		// longest name is canonical name,
		// everything else are considered aliases
		option.name = sortByLengthDescending(names);
	}

	return option;
}

/**
 * Parses an argument syntax literal like `<value...>` into an abstract token
 *
 * Syntax:
 *  - Required arguments are denoted with <>
 *  - Optional arguments are denoted with []
 *  - Variadic arguments are denoted with an ellipsis (three dots) via ...
 * 
 * @throws BracketParseError
 */
export function parseArgumentToken(argumentValue: string): Fig.Arg {
	let isOptional = false;
	let isVariadic = false;
	const openBracket: string = argumentValue[0];
	const closeBracket: string = argumentValue[argumentValue.length-1] as string;
	switch(openBracket) {
	case TOKEN_OPTION_BRACKET_OPTIONAL:
		isOptional = true;
		break;
	case TOKEN_OPTION_BRACKET_REQUIRED:
		isOptional = false;
		break;
	default:
		throw new BracketParseError(`Unrecognized bracket token: "${argumentValue[0]}"`);
	}

	if(!doBracketsMatch(openBracket, closeBracket)) {
		throw new BracketParseError(`Brackets do not match.\nOpen bracket: ${openBracket}\nClose bracket: ${closeBracket}`);
	}

	if(argumentValue.includes(TOKEN_OPTION_VARIADIC)) {
		isVariadic = true;
	}

	// subtract 1 to ignore the last character (closing bracket)
	let nameEndIndex: number = argumentValue.length - 1;
	if(isVariadic) {
		nameEndIndex = argumentValue.length - TOKEN_OPTION_VARIADIC.length - 1;
	}

	const option: Fig.Arg = {
		name: argumentValue.slice(1, nameEndIndex),
		isVariadic: isVariadic,
	};

	// isOptional prop is false by default, only add if true
	// see: @withfig/fig-linter/no-default-value-props
	if(isOptional) {
		option.isOptional = true;
	}

	return option;
}
