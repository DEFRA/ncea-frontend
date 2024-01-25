module.exports = {
  verbose: true,
  transform: {
    '^.+\\.(ts|js)?$': 'ts-jest',
  },
  testEnvironment: 'node',
  rootDir: '../',
  testRegex: './tests/.*\\.(test|spec)?\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  coverageReporters: ['lcov', 'cobertura', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tools/jest.env.js'],
  testTimeout: 9000,
  testResultsProcessor: 'jest-sonar-reporter',
};
