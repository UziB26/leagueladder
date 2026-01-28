# League Ladder - Testing Guide

This document describes what is tested in the League Ladder application and how to run tests.

**Last Updated**: January 2026  
**Testing Framework**: Jest 29.7.0 with React Testing Library  
**Test Environment**: jsdom (for React component testing)

---

## 🧪 Testing Overview

The League Ladder application uses **Jest** as the testing framework with **React Testing Library** for component testing. Tests are organized alongside the code they test, following Next.js conventions.

### Testing Stack

- **Jest** (^29.7.0) - Test runner and assertion library
- **React Testing Library** (^14.3.1) - React component testing utilities
- **@testing-library/jest-dom** (^6.9.1) - Custom Jest matchers for DOM
- **@testing-library/user-event** (^14.6.1) - User interaction simulation
- **ts-jest** (^29.4.6) - TypeScript support for Jest
- **jest-environment-jsdom** (^29.7.0) - Browser-like environment for React tests

---

## 📋 What Is Tested

The application currently has test coverage for the following areas:

### 1. Elo Rating System (`src/lib/elo.test.ts`)

Comprehensive tests for the Elo rating calculation system, which is core to the league ladder functionality.

**Test Coverage:**
- ✅ **Expected Score Calculation**
  - Equal ratings return 0.5 expected score
  - Higher rated player has > 0.5 expected score
  - Lower rated player has < 0.5 expected score
  - Large rating differences handled correctly
  - Negative rating differences handled correctly

- ✅ **Margin of Victory Multiplier**
  - Returns 1.0 when margin of victory is disabled
  - Returns 1.0 when score difference is 0
  - Returns multiplier > 1.0 for larger score differences
  - Multiplier capped at 2.0
  - Higher multiplier for larger score differences

- ✅ **Score Value Calculation**
  - Returns 0.5 for draws
  - Returns 1.0 when player1 wins in close match
  - Returns 0.0 when player2 wins in close match
  - Returns score ratio for larger margins
  - Handles very large score differences

- ✅ **New Rating Calculations**
  - Increases winner rating when higher rated player wins
  - Increases winner rating when lower rated player wins (upset)
  - Handles draws correctly (no rating change)
  - Applies margin of victory multiplier
  - Maintains zero-sum property
  - Rounds rating changes to integers

- ✅ **Match Calculation Integration**
  - Calculates ratings for matches with equal ratings
  - Handles draws correctly
  - Gives larger rating changes for larger victories
  - Handles upset victories (lower rated player wins)
  - Handles expected victories (higher rated player wins)
  - Works with different K-factors
  - Handles edge case scores
  - Handles very large scores

- ✅ **Integration Tests**
  - Maintains rating stability over multiple matches
  - Converges ratings when one player consistently wins

**Key Test Scenarios:**
- Equal ratings matches
- Upset victories (lower rated player wins)
- Expected victories (higher rated player wins)
- Draws
- Large score differences
- Rating stability over time
- K-factor variations (32, 16)

### 2. Database State Transitions (`src/lib/db/state-transitions.test.ts`)

Tests for the state machine transitions that govern challenges, matches, and rating updates.

**Test Coverage:**
- ✅ **Challenge State Transitions**
  - `pending` → `accepted` (valid)
  - `pending` → `declined` (valid)
  - `accepted` → `completed` (valid)
  - Invalid transitions prevented (e.g., `declined` → `accepted`)

- ✅ **Match State Transitions**
  - `pending` → `pending_confirmation` (valid)
  - `pending_confirmation` → `completed` (valid)
  - `pending_confirmation` → `disputed` (valid)
  - `completed` → `voided` (valid, admin action)
  - Invalid transitions prevented (e.g., `voided` → `completed`)

- ✅ **Rating Update Rules**
  - Ratings only update when match status is `completed`
  - Ratings do NOT update for: `pending`, `pending_confirmation`, `disputed`, `voided`
  - Ratings are reverted when match is voided
  - Ratings do not update for `pending_confirmation` matches

- ✅ **Opponent Confirmation Flow**
  - Requires opponent confirmation before rating update
  - Opponent can confirm or dispute
  - Ratings update only after confirmation

- ✅ **Validation Rules**
  - Prevents self-challenge
  - Prevents self-match
  - Validates score formats (0-1000, integers only)
  - Requires at least one non-zero score

**State Machine Diagram:**
```
Challenge States:
pending → accepted → completed
       ↘ declined

Match States:
pending → pending_confirmation → completed → voided (admin)
                              ↘ disputed
```

### 3. UI Components (`src/components/ui/button.test.tsx`)

Tests for reusable UI components, specifically the Button component.

**Test Coverage:**
- ✅ **Basic Rendering**
  - Renders with default props
  - Renders with custom text

- ✅ **Variants**
  - Default variant styles
  - Secondary variant styles
  - Outline variant styles
  - Ghost variant styles

- ✅ **Sizes**
  - Default size styles
  - Small size styles
  - Large size styles

- ✅ **Interactions**
  - Calls onClick when clicked
  - Does not call onClick when disabled
  - Disabled state works correctly

- ✅ **Accessibility**
  - Has proper button role
  - Supports aria-label
  - Supports aria-disabled

- ✅ **Custom Styling**
  - Merges custom className with default classes
  - Preserves default classes when custom className provided

- ✅ **Ref Forwarding**
  - Forwards ref to button element

- ✅ **HTML Attributes**
  - Passes through standard HTML button attributes
  - Supports data attributes

- ✅ **Focus Management**
  - Has focus-visible styles
  - Is focusable when not disabled

---

## 🚀 How to Run Tests

### Prerequisites

Ensure all dependencies are installed:
```bash
npm install
```

**Note:** The `package.json` may not have a `test` script defined. You can either:
1. Use Jest directly: `npx jest`
2. Add test scripts to `package.json` (recommended):
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage"
     }
   }
   ```

### Basic Test Commands

#### Run All Tests
```bash
# Using Jest directly (if test script is not in package.json)
npx jest

# Or add to package.json scripts:
# "test": "jest"
# Then use: npm test
```

This runs Jest and executes all test files matching the pattern:
- `**/__tests__/**/*.[jt]s?(x)`
- `**/?(*.)+(spec|test).[jt]s?(x)`

**Note:** If `npm test` doesn't work, use `npx jest` directly. You can add a test script to `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

#### Run Tests in Watch Mode
```bash
# Using Jest directly
npx jest --watch

# Or if test script is added: npm test -- --watch
```

Runs tests in watch mode, automatically re-running tests when files change. Useful during development.

#### Run Tests with Coverage Report
```bash
# Using Jest directly
npx jest --coverage

# Or if test script is added: npm test -- --coverage
```

Generates a coverage report showing:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

Coverage report is saved to `coverage/` directory and can be viewed in HTML format.

#### Run Specific Test File
```bash
# Using Jest directly
npx jest src/lib/elo.test.ts

# Or if test script is added: npm test -- src/lib/elo.test.ts
```

Runs only the specified test file.

#### Run Tests Matching a Pattern
```bash
# Using Jest directly
npx jest --testNamePattern="Elo"

# Or if test script is added: npm test -- --testNamePattern="Elo"
```

Runs only tests whose names match the pattern.

#### Run Tests in Verbose Mode
```bash
# Using Jest directly
npx jest --verbose

# Or if test script is added: npm test -- --verbose
```

Shows detailed output for each test, including which tests are running.

#### Run Tests in Silent Mode
```bash
# Using Jest directly
npx jest --silent

# Or if test script is added: npm test -- --silent
```

Suppresses console output from tests (useful for CI/CD).

### Advanced Test Commands

#### Run Tests with Specific Reporter
```bash
# Using Jest directly
npx jest --reporters=default --reporters=jest-junit

# Or if test script is added: npm test -- --reporters=default --reporters=jest-junit
```

#### Run Tests with Maximum Workers
```bash
# Using Jest directly
npx jest --maxWorkers=4

# Or if test script is added: npm test -- --maxWorkers=4
```

#### Run Tests and Update Snapshots
```bash
# Using Jest directly
npx jest --updateSnapshot

# Or if test script is added: npm test -- --updateSnapshot
```

#### Run Tests and Clear Cache
```bash
# Using Jest directly
npx jest --clearCache

# Or if test script is added: npm test -- --clearCache
```

### Continuous Integration

For CI/CD pipelines, use:
```bash
# Using Jest directly
npx jest --ci --coverage --maxWorkers=2

# Or if test script is added: npm test -- --ci --coverage --maxWorkers=2
```

This runs tests in CI mode (non-interactive), generates coverage, and limits workers for resource-constrained environments.

---

## ⚙️ Test Configuration

### Jest Configuration (`jest.config.js`)

The project uses Next.js's Jest integration with custom configuration:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/ui/(.*)$': '<rootDir>/components/ui/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
      },
    }],
  },
}

module.exports = createJestConfig(customJestConfig)
```

**Key Configuration Details:**
- **Test Environment**: `jest-environment-jsdom` (for React component testing)
- **Path Aliases**: Supports `@/` imports (maps to `src/`)
- **Coverage Collection**: Collects from `src/**/*.{js,jsx,ts,tsx}` excluding:
  - Type definition files (`.d.ts`)
  - Story files (`.stories.*`)
  - Test directories (`__tests__`)
- **Test File Patterns**: Matches files in `__tests__` directories or files ending in `.test.*` or `.spec.*`

### Jest Setup (`jest.setup.js`)

The setup file imports `@testing-library/jest-dom` to add custom matchers:
- `toBeInTheDocument()`
- `toBeVisible()`
- `toHaveClass()`
- `toHaveTextContent()`
- And more...

### TypeScript Configuration

Tests use TypeScript with `ts-jest` transformer:
- Supports `.ts` and `.tsx` files
- JSX support enabled
- Uses project's `tsconfig.json`

---

## 📁 Test File Structure

Tests are organized alongside the code they test:

```
src/
├── lib/
│   ├── elo.ts
│   ├── elo.test.ts          # Tests for Elo calculator
│   └── db/
│       ├── state-transitions.test.ts  # Tests for state machine
│       └── ...
├── components/
│   └── ui/
│       ├── button.tsx
│       └── button.test.tsx   # Tests for Button component
└── ...

app/
└── (test files would be co-located with components if added)
```

**Naming Conventions:**
- Test files: `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`
- Test directories: `__tests__/`
- Test files should be co-located with the code they test

---

## 📊 Test Coverage

### Current Coverage

The application has test coverage for:

1. **Core Business Logic** ✅
   - Elo rating calculations (comprehensive)
   - State transitions (comprehensive)

2. **UI Components** ✅
   - Button component (comprehensive)

3. **API Routes** ⚠️ (Not currently tested)
   - API endpoints are not covered by unit tests
   - Consider adding integration tests for critical API routes

4. **Database Operations** ⚠️ (Not currently tested)
   - Database queries and transactions are not covered
   - Consider adding integration tests with test database

5. **Authentication** ⚠️ (Not currently tested)
   - Auth flows are not covered
   - Consider adding tests for login/registration flows

### Coverage Goals

**Recommended Coverage Targets:**
- Core business logic: **> 90%** ✅ (Achieved)
- UI components: **> 80%** ✅ (Achieved for Button)
- API routes: **> 70%** ⚠️ (Not yet implemented)
- Utility functions: **> 80%** ⚠️ (Partial)

---

## 🧩 Writing Tests

### Test Structure

Follow this structure for new tests:

```typescript
import { describe, it, expect, beforeEach } from '@jest/globals'
import { YourFunction } from './your-module'

describe('YourFunction', () => {
  beforeEach(() => {
    // Setup before each test
  })

  describe('Feature Group', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test'
      
      // Act
      const result = YourFunction(input)
      
      // Assert
      expect(result).toBe('expected')
    })
  })
})
```

### React Component Testing

For React components, use React Testing Library:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { YourComponent } from './your-component'

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should handle user interactions', () => {
    const handleClick = jest.fn()
    render(<YourComponent onClick={handleClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the code does, not how it does it
   - Test user-facing behavior

2. **Use Descriptive Test Names**
   - Test names should clearly describe what is being tested
   - Use format: "should [expected behavior] when [condition]"

3. **Keep Tests Isolated**
   - Each test should be independent
   - Use `beforeEach`/`afterEach` for setup/teardown

4. **Follow AAA Pattern**
   - **Arrange**: Set up test data
   - **Act**: Execute the code being tested
   - **Assert**: Verify the results

5. **Test Edge Cases**
   - Test boundary conditions
   - Test error cases
   - Test null/undefined inputs

6. **Mock External Dependencies**
   - Mock API calls
   - Mock database operations
   - Mock external services

---

## 🔍 Debugging Tests

### Running Tests in Debug Mode

Use Node.js debugger:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then attach Chrome DevTools at `chrome://inspect`.

### Using VS Code Debugger

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest: Current File",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["${relativeFile}", "--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Console Logging

Add `console.log()` statements in tests (they won't appear in normal mode, use `--verbose`):
```bash
npm test -- --verbose
```

---

## 🚨 Common Issues and Solutions

### Issue: Tests Fail with "Cannot find module"

**Solution:**
- Ensure path aliases are correctly configured in `jest.config.js`
- Check that `moduleNameMapper` matches your `tsconfig.json` paths

### Issue: React Component Tests Fail

**Solution:**
- Ensure `jest-environment-jsdom` is installed
- Check that `testEnvironment` is set to `'jest-environment-jsdom'` in `jest.config.js`

### Issue: TypeScript Errors in Tests

**Solution:**
- Ensure `ts-jest` is installed
- Check that `transform` configuration includes TypeScript files
- Verify `tsconfig.json` includes test files

### Issue: Coverage Report Not Generated

**Solution:**
- Run with `--coverage` flag
- Check that `collectCoverageFrom` in `jest.config.js` includes your source files

### Issue: Tests Run Slowly

**Solution:**
- Use `--maxWorkers` to limit parallel workers
- Consider splitting large test files
- Use `--runInBand` to run tests serially (slower but more stable)

---

## 📚 Additional Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Jest DOM](https://github.com/testing-library/jest-dom)
- [Next.js Testing Guide](https://nextjs.org/docs/app/building-your-application/testing)

### Test Examples in Codebase
- `src/lib/elo.test.ts` - Business logic testing example
- `src/lib/db/state-transitions.test.ts` - State machine testing example
- `src/components/ui/button.test.tsx` - React component testing example

---

## ✅ Test Checklist

Before committing code, ensure:

- [ ] All existing tests pass (`npx jest` or `npm test` if script is added)
- [ ] New functionality has corresponding tests
- [ ] Tests follow naming conventions (`*.test.ts` or `*.spec.ts`)
- [ ] Tests are isolated and don't depend on each other
- [ ] Edge cases are covered
- [ ] Error cases are tested
- [ ] Test coverage is maintained or improved
- [ ] Tests run in CI/CD pipeline

---

**Last Updated**: January 2026  
**Test Framework**: Jest 29.7.0  
**Status**: Active Testing ✅
