// Jest setup for unit tests
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Polyfills for Node.js < 20
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock window.location if needed
delete window.location;
window.location = {
  protocol: 'http:',
  hostname: 'localhost',
  port: '3000',
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
