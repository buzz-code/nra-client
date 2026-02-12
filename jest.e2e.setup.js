// Jest setup for e2e tests
// Set environment to test
process.env.NODE_ENV = 'test';

// Set longer timeout for e2e tests
jest.setTimeout(30000);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection in e2e test:', reason);
});
