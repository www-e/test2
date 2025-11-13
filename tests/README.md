# Testing

This project uses [Vitest](https://vitest.dev/) for testing, along with [React Testing Library](https://testing-library.com/) for React component testing and [Testing Library Jest DOM](https://github.com/testing-library/jest-dom) for DOM assertions.

## Running Tests

```bash
# Run all tests in watch mode (default)
npm test

# Run all tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests and generate coverage report
npm run test:coverage
```

## Test Structure

- Unit tests for utility functions are in `__tests__/calculations.test.ts`
- API route tests are in `__tests__/*-api.test.ts`
- Component-related tests (using utilities/components used by components) are in `__tests__/*.test.{ts,tsx}`

## Writing Tests

### Unit Tests
For utility functions like those in `src/lib/calculations.ts`, create a file in `__tests__/` with the same name and `.test.ts` extension.

### API Route Tests
For Next.js API routes, mock the dependencies and test the responses. See `__tests__/discussions-api.test.ts` for an example.

### Component Tests
For server components with async dependencies (like those using `getServerSession`), focus on testing the utility functions and logic that the components use, rather than trying to render the full component.

## Test Configuration

- Environment: `jsdom` (for DOM APIs and browser globals)
- Setup file: `tests/setup.ts` (imports `@testing-library/jest-dom`)
- Test files: `**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`
- Coverage provider: `v8`