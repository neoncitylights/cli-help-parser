import { parseArgumentToken, parseOptionToken, parseOptionLineToken } from '../src/index';

test('argument parses correctly', () => {
	expect(parseArgumentToken('<value...>')).toMatchObject(
		{
			name: 'value',
			isVariadic: true,
		}
	);
});

test('option parses correctly', () => {
	expect(parseOptionToken('-c, --config <value...>')).toMatchObject(
		{
			name: ['--config', '-c'],
			description: '',
			args: {
				name: 'value',
				isVariadic: true,
			}
		}
	);
});

test('option line parses correctly', () => {
	const line = '-c, --config <value...>                                                            Provide path to a webpack configuration file e.g. ./webpack.config.js.';
	expect(parseOptionLineToken(line)).toMatchObject(
		{
			name: ['--config', '-c'],
			description: 'Provide path to a webpack configuration file e.g. ./webpack.config.js.',
			args: {
				name: 'value',
				isVariadic: true,
			}
		}
	);
});
