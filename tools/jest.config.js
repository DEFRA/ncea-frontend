module.exports = {
  verbose: true,
  transform: {
    '^.+\\.(ts|js)?$': 'ts-jest',
  },
  testEnvironment: 'node',
  rootDir: '../',
  testRegex: './tests/.*\\.(test|spec)?\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/tests'],
  testPathIgnorePatterns: ['<rootDir>/src/infrastructure/plugins/'],
  coveragePathIgnorePatterns: ['<rootDir>/src/infrastructure/plugins/'],
  coverageReporters: ['html'],
};
