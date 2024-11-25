# DRQ Website

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

## Firebase Setup

This project uses Firebase for authentication, database, and storage functionality. To set up Firebase in your development environment:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

2. Copy your Firebase configuration from the Firebase Console:
   - Go to Project Settings
   - Under "Your apps", create a new web app or select an existing one
   - Copy the configuration object

3. Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Firebase Utilities

The project includes several Firebase utility functions in `src/utils/firebase.ts`:

### Authentication
- `useAuth()`: Hook for accessing the current user and auth state
- `signIn(email, password)`: Sign in with email and password
- `signUp(email, password)`: Create a new user account
- `logOut()`: Sign out the current user

### Firestore Database
- `createDocument(collection, docId, data)`: Create a new document
- `getDocument(collection, docId)`: Get a document by ID
- `updateDocument(collection, docId, data)`: Update a document
- `deleteDocument(collection, docId)`: Delete a document
- `queryDocuments(collection, field, operator, value)`: Query documents

### Storage
- `uploadFile(path, file)`: Upload a file to Firebase Storage
- `deleteFile(path)`: Delete a file from Firebase Storage

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Firebase configuration as described above
4. Choose your branch: `git checkout branch-name`
5. Start development server: `npm run dev`

## Type Safety

All Firebase utility functions are fully typed with TypeScript for better development experience and type safety. When using these functions, provide the correct type parameters:

```typescript
interface UserProfile {
  name: string;
  email: string;
  age: number;
}

// The function will enforce the UserProfile type
const userDoc = await getDocument<UserProfile>('users', 'user123');
```

## Contact

For questions or issues, please contact the development team lead.
