export function sortByLengthDescending(items: string[]): string[] {
	return items.sort((a, b) => {
		if(a.length < b.length) { return 1; }
		if(a.length > b.length) { return -1; }
		return 0;
	});
}

/**
 * Verifies that the given character is an ASCII digit, checking
 * in the inclusive range between U+0030 and U+0039:
 * - U+0039: DIGIT ZERO
 * - U+0030: DIGIT NINE
 */
export function isAsciiDigit(character: string): boolean {
	const codepoint: number|undefined = character.codePointAt(0);
	if(codepoint == undefined) { return false; }
	return codepoint >= 48 && codepoint <= 57;
}

/**
 * Verifies that the given character is an ASCII letter, checking
 * in the ranges between:
 * - [U+0041, U+005A]: Latin lowercase letters (a..z)
 * - [U+0061, U+007A]: Latin uppercase letters (A..Z)
 */
export function isAsciiLetter(character: string): boolean {
	const codepoint: number|undefined = character.codePointAt(0);
	if(codepoint == undefined) { return false; }
	return (codepoint >= 65 && codepoint <= 90) || (codepoint >= 97 && codepoint <= 122);
}

export function doBracketsMatch(openBracket: string, closeBracket: string): boolean {
	return (openBracket == '{' && closeBracket == '}') ||
		(openBracket == '[' && closeBracket == ']') ||
		(openBracket == '(' && closeBracket == ')') ||
		(openBracket == '<' && closeBracket == '>');
}

export function getClosingBracket(openBracket: string): string {
	switch(openBracket) {
	case '{': return '}';
	case '[': return ']';
	case '(': return ')';
	case '<': return '>';
	default: return '';
	}
}
