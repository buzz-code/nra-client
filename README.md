# NRA Client

Shared client library for NRA applications. Contains React components, providers, utilities, and configurations used across NRA projects.

## Installation

This library is typically used as a Git submodule in parent projects like `teacher-report-nra` and `student-report-nra`.

## Development

### Prerequisites

- Node.js 20 or higher
- Yarn package manager

### Setup

```bash
# Install dependencies
yarn install
```

### Testing

The project includes both unit tests and e2e tests:

```bash
# Run all unit tests
yarn test

# Run unit tests in watch mode
yarn test:watch

# Run unit tests with coverage
yarn test:coverage

# Run e2e tests
yarn test:e2e
```

### Test Structure

- Unit tests: Located in `__tests__` directories alongside the code they test
- E2E tests: Located in `__tests__` directories with `.e2e-spec.js` or `.e2e-test.js` extensions
- Test configuration:
  - `jest.config.js` - Configuration for unit tests
  - `jest.e2e.config.js` - Configuration for e2e tests
  - `jest.setup.js` - Setup file for unit tests
  - `jest.e2e.setup.js` - Setup file for e2e tests

### CI/CD

Tests are automatically run on:
- Pull requests to main branch
- Pushes to main branch  
- Merge queue events

The GitHub Actions workflow is defined in `.github/workflows/test.yml`.

## Project Structure

```
.
├── components/       # React components
├── config/          # Configuration files
├── providers/       # React Admin providers
│   └── __tests__/   # Provider tests
├── utils/           # Utility functions
│   └── __tests__/   # Utility tests
└── .github/         # GitHub Actions workflows
```

## Usage in Parent Projects

This library is included as a Git submodule in parent projects and is aliased as `@shared` in the module name mapping:

```javascript
import { dataProvider } from '@shared/providers/dataProvider';
import { authProvider } from '@shared/providers/authProvider';
```

## Contributing

1. Make changes to the code
2. Ensure all tests pass: `yarn test && yarn test:e2e`
3. Commit and push changes
4. Create a pull request

## License

UNLICENSED - Private use only
