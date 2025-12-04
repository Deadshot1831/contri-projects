module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};