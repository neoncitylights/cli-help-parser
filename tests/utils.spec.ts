import {
	sortByLengthDescending,
	isAsciiDigit,
	isAsciiLetter,
	doBracketsMatch,
	getClosingBracket
} from '../src/index';

test('correctly sorts array by descending order', () => {
	expect(sortByLengthDescending(['a', 'abcd', 'ab', 'abc'])).toEqual(['abcd', 'abc', 'ab', 'a']);
})
test('correctly detects ASCII digit', () => {
	expect(isAsciiDigit('0')).toBe(true);
})

test('correctly detects ASCII letter', () => {
	expect(isAsciiLetter('a')).toBe(true);
	expect(isAsciiLetter('z')).toBe(true);
	expect(isAsciiLetter('A')).toBe(true);
	expect(isAsciiLetter('Z')).toBe(true);

	expect(isAsciiLetter('Ã')).toBe(false);
});

test('brackets match', () => {
	expect(doBracketsMatch('{', '}')).toBe(true);
	expect(doBracketsMatch('<', '>')).toBe(true);
	expect(doBracketsMatch('(', ')')).toBe(true);
	expect(doBracketsMatch('[', ']')).toBe(true);

	expect(doBracketsMatch('{', ']')).toBe(false);
});

test('correctly gets closing bracket', () => {
	expect(getClosingBracket('{')).toBe('}');
	expect(getClosingBracket('<')).toBe('>');
	expect(getClosingBracket('(')).toBe(')');
	expect(getClosingBracket('[')).toBe(']');

	expect(getClosingBracket('.')).toBe('');
});
