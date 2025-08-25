# Visual Subnet Calculator

See ~/CLAUDE.md for global standards.

## Project Overview

Modern Visual Subnet Calculator built with React + TypeScript + Tailwind CSS. Provides intuitive subnet visualization and calculation capabilities similar to davidc.net's subnet calculator but with modern UI/UX practices.

## Key Features

- **Modern Stack**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **Core Functionality**:
  - IPv4 subnet calculations with comprehensive validation
  - CIDR notation support (/0 to /32)
  - Interactive subnet visualization with visual blocks
  - Advanced subnet division and joining with visual feedback
  - Multiple export formats (JSON, CSV, sharing)
  - Network efficiency analysis and optimization insights
- **UI/UX**:
  - Professional gradient-based design system
  - Fully responsive (mobile-first approach)
  - Dark/light mode with system preference detection
  - Real-time calculation with smooth animations
  - Comprehensive accessibility (WCAG compliant)
  - Keyboard navigation and shortcuts
  - Copy-to-clipboard functionality
  - Expandable binary representation

## Architecture

- **Frontend**: Single-page React application
- **State Management**: React hooks (useState, useContext)
- **Styling**: Tailwind CSS with custom subnet color palette
- **Build Tool**: Vite for fast development and optimized builds
- **Type Safety**: Full TypeScript coverage

## Development Commands

```bash
# Development server
npm run dev

# Production build  
npm run build

# Preview production build
npm run preview

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

## Component Structure

- `App.tsx`: Main application component with routing
- `components/SubnetCalculator.tsx`: Core calculator component
- `components/SubnetVisualization.tsx`: Visual subnet representation
- `components/InputForm.tsx`: IP/CIDR input handling
- `components/ResultsTable.tsx`: Calculation results display
- `utils/subnetCalculations.ts`: Core subnet math utilities
- `types/subnet.ts`: TypeScript type definitions

## Recent Improvements (2024)

### UI/UX Enhancements
- **Consolidated Layout**: Reduced vertical space usage by 50% while maintaining readability
- **Interactive Binary View**: Expandable binary representation with copy functionality
- **Visual Subnet Joining**: Intuitive color-coded feedback for merging adjacent subnets
- **Professional Design**: Modern gradient-based design system with improved visual hierarchy

### Technical Improvements
- **Tailwind CSS v4**: Migrated to latest version with @theme directive approach
- **Efficiency Calculation**: Fixed precision rounding for large subnets
- **Dark Mode**: Full theme switching with system preference detection
- **Performance**: Optimized re-renders with React.memo, useMemo, and useCallback

### Accessibility
- **WCAG Compliance**: Enhanced screen reader support and keyboard navigation
- **Focus Management**: Proper focus indicators and tab order
- **Touch Optimization**: 44px minimum touch targets for mobile accessibility

## Testing

```bash
# Run test suite
npm test

# Run tests with UI
npm test:ui

# Generate coverage report
npm run test:coverage

# Type checking
npx tsc --noEmit
```

## Deployment

- Static site deployment ready (Vercel/Netlify compatible)
- Docker containerization available
- CI/CD via GitHub Actions