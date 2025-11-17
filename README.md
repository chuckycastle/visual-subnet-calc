# Visual Subnet Calculator

IPv4 subnet calculator with visualization and CIDR notation support (/0 to /32).

![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg) ![React](https://img.shields.io/badge/React-19.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-blue)

## Features

- **IPv4 Subnet Calculations** - Network address, broadcast address, subnet mask, host range
- **CIDR Notation** - /0 to /32 prefix length with validation
- **Subnet Visualization** - Color-coded subnet blocks with selection
- **Subnet Division** - Split subnets into two equal-sized networks
- **Subnet Joining** - Merge two adjacent subnets into larger network
- **Binary Representation** - Expandable binary display for network addresses and masks
- **Export Formats** - JSON, CSV, and Web Share API integration
- **Dark Mode** - Theme switching with system preference detection
- **Keyboard Navigation** - Tab, Enter, and keyboard shortcuts
- **Accessibility** - WCAG 2.1 Level AA compliance with screen reader support

## Requirements

- **Node.js** 18 or higher
- **npm** 8 or higher (or yarn/pnpm equivalent)

## Installation

### Clone and Run

```bash
git clone https://github.com/chuckycastle/visual-subnet-calc.git
cd visual-subnet-calc
npm install
npm run dev
```

Open browser to http://localhost:5173

### Production Build

```bash
npm run build        # Compile TypeScript and build for production
npm run preview      # Preview production build locally
```

## Usage

### Calculate Subnet

1. Enter IP address (e.g., `192.168.1.0`)
2. Enter CIDR prefix (e.g., `24`)
3. Click **Calculate Network** or press Enter

### Subnet Operations

```
D key       - Divide selected subnet into two /25 networks
J key       - Toggle subnet joining mode
Escape      - Exit joining mode
Tab         - Navigate between inputs
Enter       - Submit calculation
```

### Export Options

- **JSON** - Complete subnet data with all fields
- **CSV** - Network addresses, masks, and host counts
- **Share** - Copy shareable text summary to clipboard

## Project Structure

```
src/
├── components/
│   ├── SubnetCalculator.tsx    # Main calculator interface
│   ├── InputForm.tsx           # IP address and CIDR input
│   ├── ResultsTable.tsx        # Network analysis display
│   └── SubnetVisualization.tsx # Visual subnet blocks
├── hooks/
│   └── useDarkMode.ts          # Theme state management
├── types/
│   └── subnet.ts               # TypeScript interfaces
├── utils/
│   ├── subnetCalculations.ts   # Core subnet mathematics
│   └── exportUtils.ts          # JSON/CSV export
├── App.tsx                      # Application root
└── main.tsx                     # Entry point
```

## Development

### Scripts

```bash
npm run dev              # Start development server
npm run build            # TypeScript compilation + Vite build
npm run preview          # Preview production build
npm run lint             # ESLint validation
npm run test             # Run Vitest test suite
npm run test:ui          # Vitest UI interface
npm run test:coverage    # Generate coverage report
npm run type-check       # TypeScript validation
```

### Technology Stack

- **React** 19.1 - UI framework
- **TypeScript** 5.8 - Type system
- **Vite** 7.1 - Build tool and dev server
- **Tailwind CSS** 4.1 - Utility-first CSS framework
- **Vitest** 3.2 - Unit and component testing
- **Lucide React** 0.541 - Icon library

## Network Analysis Details

### Calculated Values

- **Network Address** - First address in subnet (e.g., `192.168.1.0`)
- **Broadcast Address** - Last address in subnet (e.g., `192.168.1.255`)
- **Subnet Mask** - Decimal notation (e.g., `255.255.255.0`)
- **Wildcard Mask** - Inverse of subnet mask (e.g., `0.0.0.255`)
- **First Usable IP** - First host address (network address + 1)
- **Last Usable IP** - Last host address (broadcast address - 1)
- **Total Addresses** - 2^(32 - CIDR)
- **Usable Addresses** - Total - 2 (excludes network and broadcast)
- **Efficiency** - (Usable / Total) × 100

### Network Types

- **Host Route** (`/32`) - Single IP address, no usable hosts
- **Point-to-Point** (`/31`) - RFC 3021 two-host link
- **Standard Subnet** (`/1` to `/30`) - Traditional subnetting
- **Supernet** (`/0` to `/8`) - Large address blocks

### Binary Display

Click binary section to expand full representation:
- Network address in dotted binary (e.g., `11000000.10101000.00000001.00000000`)
- Subnet mask in dotted binary (e.g., `11111111.11111111.11111111.00000000`)

## Keyboard Shortcuts

### Navigation
- `Tab` - Move to next input field
- `Shift+Tab` - Move to previous input field
- `Enter` - Calculate network or confirm selection

### Actions
- `D` - Divide selected subnet
- `J` - Toggle joining mode
- `Escape` - Cancel joining mode or close dialogs

### Accessibility
- Screen reader announcements for subnet calculations
- Focus indicators on all interactive elements
- Keyboard-only navigation support
- 44px minimum touch targets on mobile

## Testing

### Run Tests

```bash
npm test                 # Watch mode for development
npm run test:coverage    # Full coverage report
npm run test:ui          # Interactive test UI
```

### Test Coverage

- **Unit Tests** - Subnet calculations, validation, export functions
- **Component Tests** - User interactions, state management
- **Integration Tests** - Complete subnet calculation workflows

**Coverage Targets**:
- `utils/subnetCalculations.ts`: 100%
- `utils/exportUtils.ts`: 90%+
- Components: 80%+

## Deployment

### Static Site Hosts

- **GitHub Pages** - Free hosting for public repositories
- **Vercel** - Zero-config deployment from Git
- **Netlify** - Continuous deployment with drag-and-drop
- **AWS S3 + CloudFront** - Global CDN distribution

### Docker Container

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build Output

```bash
npm run build
# Output: dist/
#   ├── index.html          # Entry point
#   ├── assets/*.js         # Bundled JavaScript
#   └── assets/*.css        # Compiled Tailwind CSS
```

## Browser Support

- **Desktop**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Requirements**: ES2020, CSS Grid, Flexbox, Web Share API (optional)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow and coding standards.

### Quick Start for Contributors

1. Fork repository on GitHub
2. Clone your fork locally
3. Create feature branch: `git checkout -b feature/your-feature`
4. Make changes with tests
5. Run full test suite: `npm test && npm run lint`
6. Commit changes: `git commit -m "Add feature"`
7. Push to fork: `git push origin feature/your-feature`
8. Open pull request on GitHub

## License

This work is licensed under CC BY-NC-SA 4.0 (Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International).

See [LICENSE](LICENSE) file for details or visit https://creativecommons.org/licenses/by-nc-sa/4.0/

## Links

- **Repository**: https://github.com/chuckycastle/visual-subnet-calc
- **Issues**: https://github.com/chuckycastle/visual-subnet-calc/issues
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)
