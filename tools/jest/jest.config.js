const ignoreErrorCode = 1343;
module.exports = {
  verbose: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|js)?$': 'ts-jest',
  },
  rootDir: '../../',
  testRegex: './__tests__/.*\\.(test|spec)?\\.(ts|js)$',
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/__tests__', '<rootDir>/src'],
  coveragePathIgnorePatterns: ['<rootDir>/__tests__/'],
  coverageReporters: ['lcov', 'cobertura', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tools/jest/jest.env.js'],
  testTimeout: 9000,
  testResultsProcessor: 'jest-sonar-reporter',
};
