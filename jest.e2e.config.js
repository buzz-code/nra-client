module.exports = {
  ...require('./jest.config.js'),
  testMatch: ['**/__tests__/**/*.(e2e-spec|e2e-test).(js|jsx|ts|tsx)'],
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/jest.e2e.setup.js'],
};
