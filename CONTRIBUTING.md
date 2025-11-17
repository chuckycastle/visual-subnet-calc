# Contributing to Visual Subnet Calculator

Contributions are welcome. This guide provides setup instructions, coding standards, and submission process.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Reporting Issues](#reporting-issues)
- [Contributing Code](#contributing-code)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)

## Code of Conduct

1. **Technical focus** - Keep discussions technical and fact-based
2. **Constructive feedback** - Critique code, not people
3. **Respectful communication** - Professional tone in all interactions
4. **Issue-driven development** - Create issues before starting work

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **Git** 2.x or higher
- **Code editor** with TypeScript support (VS Code recommended)

### Setup

```bash
# Fork repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/visual-subnet-calc.git
cd visual-subnet-calc

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Verify everything works
npm run lint
npm run type-check
npm run build
```

### Project Structure

```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Pure utility functions
└── __tests__/         # Test files
```

## Reporting Issues

### Before Creating an Issue

1. Search existing issues for duplicates
2. Check if issue is already fixed in `main` branch
3. Gather reproduction steps and system information

### Creating an Issue

Use the appropriate issue template:

- **Bug Report** - Unexpected behavior or errors
- **Feature Request** - New functionality suggestions
- **Documentation** - Documentation improvements
- **Question** - Usage questions or clarifications

### Bug Report Requirements

- **Description** - Clear description of the bug
- **Steps to Reproduce** - Numbered list of exact steps
- **Expected Behavior** - What should happen
- **Actual Behavior** - What actually happens
- **Environment** - Browser, OS, Node.js version
- **Screenshots** - If applicable

## Contributing Code

### Finding Work

1. **Good First Issues** - Labeled `good-first-issue`
2. **Help Wanted** - Labeled `help-wanted`
3. **Feature Requests** - Labeled `enhancement`
4. **Bug Fixes** - Labeled `bug`

### Before Starting Work

1. Comment on the issue to claim it
2. Wait for maintainer approval
3. Create a fork and feature branch
4. Keep scope focused on the issue

## Development Workflow

### Branch Naming

```
feature/issue-123-subnet-export    # New features
fix/issue-456-validation-bug       # Bug fixes
docs/update-readme                 # Documentation
refactor/simplify-calculations     # Code refactoring
test/add-export-tests              # Test additions
```

### Making Changes

1. **Create branch** from `main`
   ```bash
   git checkout -b feature/issue-123-your-feature
   ```

2. **Make focused commits**
   - One logical change per commit
   - Follow commit message conventions
   - Include issue number in commits

3. **Write tests**
   - Unit tests for utility functions
   - Component tests for UI changes
   - Integration tests for workflows

4. **Update documentation**
   - Update README.md for new features
   - Add TSDoc comments to new functions
   - Update CHANGELOG.md

5. **Run validation**
   ```bash
   npm run lint            # ESLint
   npm run type-check      # TypeScript
   npm test                # All tests
   npm run build           # Production build
   ```

## Testing

### Running Tests

```bash
# Watch mode for development
npm test

# Single run with coverage
npm run test:coverage

# Interactive UI
npm run test:ui
```

### Writing Tests

#### Unit Tests

Test individual functions in isolation:

```typescript
// src/utils/__tests__/subnetCalculations.test.ts
import { describe, it, expect } from 'vitest';
import { validateIPAddress } from '../subnetCalculations';

describe('validateIPAddress', () => {
  it('validates correct IPv4 address', () => {
    const result = validateIPAddress('192.168.1.1');
    expect(result.isValid).toBe(true);
  });

  it('rejects invalid octet count', () => {
    const result = validateIPAddress('192.168.1');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('4 octets');
  });
});
```

#### Component Tests

Test user interactions and rendering:

```typescript
// src/components/__tests__/InputForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputForm from '../InputForm';

describe('InputForm', () => {
  it('calls onCalculate when form submitted', () => {
    const handleCalculate = vi.fn();
    render(<InputForm onCalculate={handleCalculate} />);

    const button = screen.getByText('Calculate Network');
    fireEvent.click(button);

    expect(handleCalculate).toHaveBeenCalledOnce();
  });
});
```

### Test Coverage Requirements

- **New Functions**: 100% coverage required
- **Modified Functions**: Maintain or increase coverage
- **Components**: 80%+ coverage for logic
- **Overall Project**: 85%+ coverage target

## Code Style

### TypeScript

- **Strict Mode**: All code must pass `strict: true`
- **Explicit Types**: No implicit `any`
- **Interfaces**: Prefer interfaces over types for objects
- **Immutability**: Use `const` by default, `let` when necessary

### React

- **Functional Components**: Use function declarations, not arrow functions
- **Hooks**: Follow Rules of Hooks
- **Props**: Destructure props in function signature
- **State**: Use `useState` for component state, `useContext` for shared state

### Formatting

Project uses ESLint and follows global Prettier configuration.

```bash
# Check formatting
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Key Guidelines

```typescript
// ✅ GOOD
export function calculateSubnet(input: SubnetInput): SubnetInfo {
  const { ipAddress, cidr } = input;
  // ...
}

// ❌ BAD
export const calculateSubnet = (input: SubnetInput): SubnetInfo => {
  // ...
};
```

```typescript
// ✅ GOOD - Explicit return type
function getNetworkAddress(ip: string, mask: number): string {
  return intToIp(ipToInt(ip) & cidrToMask(mask));
}

// ❌ BAD - Inferred return type
function getNetworkAddress(ip: string, mask: number) {
  return intToIp(ipToInt(ip) & cidrToMask(mask));
}
```

## Commit Messages

### Format

```
<type>: <subject>

<body>

Refs: #<issue-number>
```

### Types

- **feat** - New feature
- **fix** - Bug fix
- **docs** - Documentation changes
- **test** - Test additions or modifications
- **refactor** - Code refactoring
- **perf** - Performance improvements
- **chore** - Build process or tooling changes

### Guidelines

1. **Imperative mood**: "Add feature" not "Added feature"
2. **Lowercase subject**: Start with lowercase letter
3. **No period**: Don't end subject with period
4. **50 character limit**: Keep subject concise
5. **72 character body**: Wrap body at 72 characters
6. **Reference issues**: Include issue number

### Examples

```bash
# Good
feat: add CSV export for subnet data

Add exportToCSV function to utils/exportUtils.ts that converts
subnet data to CSV format with headers.

Refs: #45

# Bad
feat: Added a really cool CSV export feature that makes it super easy
to export your subnet calculations in CSV format
```

```bash
# Good
fix: validate CIDR range 0-32

Prevent CIDR values outside 0-32 range from causing calculation
errors. Add validation in validateCIDR function.

Refs: #78

# Bad
Fix: Fixed the bug where invalid CIDR values caused errors
```

## Pull Requests

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm test`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] New code has tests (80%+ coverage)
- [ ] Documentation updated (README, TSDoc, CHANGELOG)
- [ ] Commits follow conventional commit format
- [ ] Branch is up to date with `main`

### Submission Process

1. **Push to fork**
   ```bash
   git push origin feature/issue-123-your-feature
   ```

2. **Create pull request** on GitHub
   - Use descriptive title
   - Reference issue number
   - Fill out PR template completely
   - Add screenshots for UI changes

3. **Respond to feedback**
   - Address review comments
   - Update code as requested
   - Push additional commits
   - Request re-review when ready

### Pull Request Template

```markdown
## Description
Brief description of changes

## Related Issue
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Component tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Code follows project style
- [ ] Tests pass
- [ ] TypeScript compiles
- [ ] ESLint passes
- [ ] Documentation updated
```

### Review Process

1. **Automated Checks** - CI runs tests, linting, type checking
2. **Code Review** - Maintainer reviews code quality
3. **Testing** - Maintainer tests functionality
4. **Approval** - Maintainer approves changes
5. **Merge** - Maintainer merges to `main`

### After Merge

- Delete your feature branch
- Update your local `main` branch
- Close related issues (if not auto-closed)

## Questions?

- **Issues** - Use GitHub Issues for bugs and feature requests
- **Documentation** - Check README.md and CLAUDE.md first
- **Clarifications** - Comment on existing issues or create new one

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
