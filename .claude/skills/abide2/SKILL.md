```markdown
# abide2 Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill covers the core development patterns used in the `abide2` repository, a TypeScript React codebase. You'll learn about file naming conventions, import/export styles, commit message patterns, and how to write and organize tests. This guide is designed to help maintain consistency and efficiency when contributing to the project.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.tsx`, `dataFetcher.ts`

### Import Style
- Both default and named imports are used.
  - Example:
    ```typescript
    import React from 'react';
    import { fetchData } from './apiUtils';
    ```

### Export Style
- Prefer **named exports**.
  - Example:
    ```typescript
    export function getUser() { ... }
    export const USER_ROLE = 'admin';
    ```

### Commit Patterns
- Commit messages are **freeform** (no strict prefixes).
- Average commit message length: ~55 characters.
  - Example:  
    ```
    Add user profile component with basic styling
    ```

## Workflows

_No explicit workflows detected in the repository._

## Testing Patterns

- **Test Framework:** Unknown (not detected)
- **Test File Pattern:** Files named with `*.test.*`
  - Example: `userProfile.test.tsx`
- Place test files alongside the code they test or in a dedicated `__tests__` directory.
- Typical test file structure:
  ```typescript
  import { render } from '@testing-library/react';
  import { UserProfile } from './userProfile';

  test('renders user profile', () => {
    // test implementation
  });
  ```

## Commands
| Command | Purpose |
|---------|---------|
| /test   | Run all test files matching `*.test.*` |
| /lint   | Lint the codebase according to project rules |
| /build  | Build the project for production |
```
