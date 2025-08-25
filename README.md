# Visual Subnet Calculator

A modern, professional subnet calculator built with React, TypeScript, and Tailwind CSS. Provides intuitive IPv4 subnet analysis with interactive visualization and comprehensive network information.

![Visual Subnet Calculator](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![React](https://img.shields.io/badge/React-19.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-blue)

## ✨ Features

### Core Functionality
- **IPv4 Subnet Calculations** - Complete network analysis with validation
- **CIDR Notation Support** - Full range /0 to /32 with real-time validation
- **Interactive Visualization** - Visual subnet blocks with intuitive controls
- **Network Efficiency Analysis** - Smart efficiency scoring and optimization insights

### Advanced Features
- **Subnet Division** - Split subnets into smaller networks with one click
- **Subnet Joining** - Merge adjacent subnets with visual feedback
- **Binary Representation** - Expandable binary network and mask display
- **Multiple Export Formats** - JSON, CSV, and direct sharing capabilities

### User Experience
- **Dark/Light Mode** - Seamless theme switching with system preference detection
- **Mobile Responsive** - Optimized for all screen sizes and touch interfaces
- **Keyboard Navigation** - Full keyboard support with intuitive shortcuts
- **Copy-to-Clipboard** - One-click copying for all network values
- **Accessibility** - WCAG compliant with screen reader support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/chuckycastle/visual-subnet-calc.git
cd visual-subnet-calc

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

## 📖 Usage

### Basic Subnet Calculation
1. Enter an IP address (e.g., `192.168.1.0`)
2. Set CIDR prefix length (e.g., `24`)
3. Click **Calculate Network** or press Enter
4. View comprehensive network analysis

### Interactive Features
- **Divide Subnets**: Double-click any subnet or press `D` key
- **Join Subnets**: Click "Join Mode" and select two adjacent subnets
- **Binary View**: Click binary section to expand full binary representation
- **Copy Values**: Hover over any network value and click copy icon
- **Theme Toggle**: Click moon/sun icon to switch between light/dark modes

### Keyboard Shortcuts
- `Tab` - Navigate between elements
- `Enter` - Calculate network or select subnet
- `D` - Divide selected subnet
- `J` - Toggle joining mode
- `Escape` - Exit joining mode

## 🏗️ Architecture

### Technology Stack
- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4.1 with custom design system
- **Build Tool**: Vite 7 for lightning-fast development
- **Icons**: Lucide React for consistent iconography
- **Testing**: Vitest with React Testing Library

### Project Structure
```
src/
├── components/           # React components
│   ├── SubnetCalculator.tsx    # Main calculator interface
│   ├── InputForm.tsx           # Network input form
│   ├── ResultsTable.tsx        # Network analysis display
│   └── SubnetVisualization.tsx # Interactive subnet blocks
├── hooks/               # Custom React hooks
│   └── useDarkMode.ts          # Theme management
├── types/               # TypeScript definitions
│   └── subnet.ts               # Subnet interfaces
├── utils/               # Utility functions
│   ├── subnetCalculations.ts   # Core subnet math
│   └── exportUtils.ts          # Export functionality
└── index.css           # Global styles and theme
```

### Key Components

#### SubnetCalculator
Main application component orchestrating the entire user interface and state management.

#### SubnetVisualization  
Interactive subnet blocks with visual feedback for selection, division, and joining operations.

#### ResultsTable
Comprehensive network analysis display with expandable sections and copy functionality.

## 🧮 Calculation Details

### Supported Network Types
- **Host Routes** (`/32`) - Single host addresses
- **Point-to-Point** (`/31`) - RFC 3021 compliant links  
- **Standard Subnets** (`/1` to `/30`) - Traditional networking
- **Supernets** (`/0` to `/8`) - Large address blocks

### Network Analysis Includes
- Network and broadcast addresses
- First and last usable IP addresses
- Subnet mask and wildcard mask
- Total and usable host counts
- Network efficiency percentage
- Binary representation
- Network class identification

### Algorithm Features
- IEEE 754 compliant floating-point calculations
- Overflow-safe 32-bit integer operations
- RFC-compliant subnet validation
- Adjacent subnet detection for joining

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient scale for network elements
- **Success**: Green scale for positive states and confirmations
- **Warning**: Amber scale for caution and intermediate states
- **Subnet**: Custom cyan scale for subnet-specific visualizations

### Typography
- **Headings**: Inter font family with proper hierarchy
- **Body Text**: Optimized for readability across all screen sizes
- **Monospace**: Code and IP addresses in consistent monospace font

### Responsive Design
- **Mobile First**: Optimized for touch interfaces and small screens
- **Tablet**: Enhanced layouts with better space utilization
- **Desktop**: Full feature set with advanced interactions

## 🧪 Testing

### Running Tests
```bash
# Run test suite
npm test

# Run tests with UI
npm test:ui

# Generate coverage report  
npm run test:coverage

# Type checking
npm run type-check
```

### Testing Strategy
- **Unit Tests**: Individual utility functions and calculations
- **Component Tests**: User interface components and interactions
- **Integration Tests**: Complete user workflows and edge cases
- **Accessibility Tests**: Screen reader compatibility and keyboard navigation

## 🛠️ Development

### Code Quality
- **ESLint**: Configured with React and TypeScript rules
- **TypeScript**: Strict type checking with comprehensive coverage
- **Prettier**: Automatic code formatting (configured in global standards)

### Performance Optimizations
- **React.memo**: Optimized component re-rendering
- **useMemo/useCallback**: Expensive calculation memoization  
- **Code Splitting**: Lazy loading for improved initial load times
- **Tree Shaking**: Automatic dead code elimination

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: CSS Grid, Flexbox, ES2020, Web APIs

## 📱 Mobile Experience

### Touch-Optimized Interface
- Minimum 44px touch targets for accessibility
- Swipe gestures for subnet navigation
- Responsive typography scaling
- Optimized keyboard layouts

### Progressive Web App Ready
- Service worker compatible
- Offline functionality support
- Mobile app-like experience
- iOS/Android home screen installation

## 🚀 Deployment

### Static Site Deployment
Perfect for deployment to:
- **Vercel**: Zero-config deployment with automatic HTTPS
- **Netlify**: Continuous deployment with form handling
- **GitHub Pages**: Free hosting with custom domains
- **AWS S3 + CloudFront**: Scalable global distribution

### Docker Deployment
```dockerfile
# Multi-stage build for optimized production image
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Run the full test suite
5. Submit a pull request

### Code Standards
- Follow existing TypeScript and React patterns
- Add tests for new functionality
- Update documentation for feature changes
- Maintain accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Inspiration**: davidc.net's subnet calculator for the original concept
- **Icons**: Lucide team for the beautiful icon set
- **Design**: Tailwind CSS team for the excellent utility framework
- **Community**: React and TypeScript communities for ongoing support

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/chuckycastle/visual-subnet-calc/issues)
- **Discussions**: [GitHub Discussions](https://github.com/chuckycastle/visual-subnet-calc/discussions)
- **Documentation**: [Project Wiki](https://github.com/chuckycastle/visual-subnet-calc/wiki)

---

**Built with ❤️ by developers, for network engineers**