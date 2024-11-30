# DRQ Website

## Project Overview

Disaster Recovery Queensland website built with Next.js, TypeScript, and MongoDB.

## Development Setup

### Prerequisites

- Node.js >= 18.17.0
- npm >= 10.2.3
- VSCode with recommended extensions

### Initial Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd drq-website
```

2. Install dependencies:
```bash
npm install
```

3. Open the workspace in VSCode:
```bash
code drq-website.code-workspace
```

4. Install recommended extensions when prompted

### Environment Configuration

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Update the following variables:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3002
MONGODB_URI=your_mongodb_connection_string
```

## Development Workflow

### Branch Management

- Main branch: Production-ready code
- Development branch: Integration and testing
- Feature branches: Individual features and fixes

Branch naming convention:
```
feature/[feature-name]
fix/[issue-name]
```

### Running the Project

Development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

### Code Quality Tools

- ESLint: JavaScript/TypeScript linting
- Prettier: Code formatting
- TypeScript: Static type checking

Run checks:
```bash
npm run lint    # ESLint
npm run format  # Prettier
npm run type-check  # TypeScript
```

### VSCode Integration

#### Workspace Features

- Integrated debugging configurations
- Custom task runners
- Git integration with GitLens
- API testing with Thunder Client
- Project organization with Project Manager

#### Key Shortcuts

- Format document: `Shift + Alt + F`
- Quick fix: `Ctrl + .`
- Go to definition: `F12`
- Find references: `Shift + F12`
- Rename symbol: `F2`

### MongoDB Cache System

The project uses MongoDB for data caching:

- Page content caching
- API response caching
- Static asset caching

Cache management:
```bash
# Clear all caches
npm run cache:clear

# Warm up caches
npm run cache:warm
```

### API Development

- Thunder Client collections available in `.thunder-client/`
- Environment-specific API configurations
- Automatic request logging and monitoring

### Documentation

- API documentation generated with JSDoc
- Component documentation in Storybook
- Type definitions and interfaces

Generate documentation:
```bash
npm run docs:generate
```

### Testing

Run tests:
```bash
npm run test          # All tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Deployment

Deployment stages:
1. Development testing
2. Staging verification
3. Production release

Deploy commands:
```bash
npm run deploy:staging
npm run deploy:production
```

### Monitoring

- Winston logger integration
- Sentry error tracking
- Performance monitoring

View logs:
```bash
npm run logs:view
```

### Common Issues

#### Package Installation

If you encounter package installation issues:
1. Clear npm cache:
```bash
npm cache clean --force
```

2. Delete node_modules:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

For TypeScript errors:
1. Clear TypeScript cache:
```bash
npm run clean:typescript
```

2. Regenerate types:
```bash
npm run generate:types
```

### Project Structure

```
├── src/
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── lib/          # Core utilities
│   ├── models/       # MongoDB models
│   ├── types/        # TypeScript types
│   └── utils/        # Helper functions
├── public/           # Static assets
├── docs/            # Documentation
└── scripts/         # Build scripts
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

[License details here]
