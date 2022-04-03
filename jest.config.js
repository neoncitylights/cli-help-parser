module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/tests/**/*.spec.ts'],
	collectCoverage: true,
	collectCoverageFrom: [
		'<rootDir>/src/**/*.ts',
		'!<rootDir>/src/generate.ts',
		'!<rootDir>/src/consts.ts',
		'!<rootDir>/src/index.ts',
	],
	globals: {
		'ts-jest': {
			diagnostics: false,
		},
	},
};
