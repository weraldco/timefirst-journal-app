const nextJest = require('next/jest');

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
	dir: './',
});

const config = {
	coverageProvider: 'v8',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
	watchman: false,
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
	},
};

module.exports = createJestConfig(config);
