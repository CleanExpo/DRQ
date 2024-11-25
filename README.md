# DRQ Website Development Guide

## Branch Structure

This project uses a structured branching strategy to manage different aspects of development. Here's an overview of our branches:

### 1. Core Infrastructure Branches

- `init-setup`: Project initialization (Next.js, TypeScript, Tailwind CSS, shadcn/ui)
- `seo-metadata`: SEO and metadata implementation
- `i18n-setup`: Internationalization and language switchers

### 2. UI Component Branches

- `ui-header-footer`: Site header and footer components
- `ui-homepage`: Homepage structure and components
- `ui-service-pages`: Service-specific pages with dynamic rendering
- `ui-emergency-components`: Emergency response UI elements (alerts, timers, contact cards)

### 3. Content & Data Handling Branches

- `data-service-areas`: Service areas, regions, and historical event data
- `data-dynamic-pages`: Dynamic page generation logic
- `cms-integration`: CMS connection and integration

### 4. Performance & Optimization Branches

- `perf-optimization`: Performance optimization (images, JavaScript bundles)
- `analytics-monitoring`: Analytics and monitoring tools integration

### 5. Testing & Deployment Branches

- `testing`: Test implementation and configuration
- `deployment-setup`: Deployment configurations and CI/CD pipelines

## Development Workflow

1. **Branch Selection**
   - Choose the appropriate branch for your task based on the categories above
   - Ensure you're working on the most recent version: `git pull origin branch-name`

2. **Development Process**
   - Create feature-specific branches from these main category branches if needed
   - Follow TypeScript and project coding standards
   - Commit regularly with clear, descriptive messages

3. **Code Review & Merging**
   - Submit pull requests to merge into the category branch
   - Ensure all tests pass before requesting review
   - Address review comments promptly

4. **Conflict Resolution**
   - Keep branches focused and minimal in scope to reduce conflicts
   - Regularly sync with the main branch
   - Resolve conflicts at the feature level before merging to main

## Best Practices

- Keep commits atomic and focused
- Write clear commit messages describing what and why
- Update documentation alongside code changes
- Run tests locally before pushing
- Review your own code before requesting reviews

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Choose your branch: `git checkout branch-name`
4. Start development server: `npm run dev`

## Contact

For questions or issues, please contact the development team lead.
