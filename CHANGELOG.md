# Changelog

All notable changes to Visual Subnet Calculator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation following cidrly standards
- CONTRIBUTING.md with development workflow
- GitHub issue templates for bugs, features, questions
- TSDoc comments for public API functions

### Changed
- Rewritten README.md with factual descriptions
- Rewritten CLAUDE.md with architecture and coding standards
- Removed marketing language from all documentation

## [0.1.0] - 2025-08-25

### Added
- **IPv4 Subnet Calculator** - Calculate network addresses, subnet masks, and host ranges
- **CIDR Notation Support** - /0 to /32 prefix length with validation
- **Subnet Visualization** - Color-coded blocks with interactive selection
- **Subnet Division** - Split subnets into two equal networks
- **Subnet Joining** - Merge adjacent subnets into larger network
- **Binary Representation** - Expandable binary display for addresses and masks
- **Export Functionality** - JSON and CSV export formats
- **Web Share API** - Share subnet calculations via native share
- **Dark Mode** - Theme switching with system preference detection
- **Keyboard Navigation** - Full keyboard support with shortcuts
- **Accessibility** - WCAG 2.1 Level AA compliance
- **Input Validation** - IP address and CIDR range validation
- **Network Efficiency** - Calculate utilization percentage
- **Responsive Design** - Mobile-first layout with touch optimization
- **Copy to Clipboard** - One-click copy for all network values

### Technical
- **React 19.1** - UI framework with functional components
- **TypeScript 5.8** - Strict type checking
- **Vite 7.1** - Build tool and development server
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Vitest 3.2** - Unit and component testing
- **ESLint** - Code linting with React and TypeScript rules
- **Lucide React** - Icon library

### Testing
- Unit tests for subnet calculations
- Component tests for user interactions
- Validation tests for input handling
- Export function tests

## [0.0.0] - 2025-08-23

### Added
- Initial project setup
- Basic Vite + React + TypeScript configuration
- Tailwind CSS integration
- ESLint and Vitest configuration

---

[Unreleased]: https://github.com/chuckycastle/visual-subnet-calc/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/chuckycastle/visual-subnet-calc/releases/tag/v0.1.0
[0.0.0]: https://github.com/chuckycastle/visual-subnet-calc/releases/tag/v0.0.0
