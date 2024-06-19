module.exports = {
  testEnvironment: 'node',
  //   setupFilesAfterEnv: ['./tests/setup.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage',
  collectCoverage: [
    'controllers/**/*.js',
    'services/**/*.js',
    'repositories/**/*.js',
    'middlewares/**/*.js',
  ],
};
