# DRQ Website

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

4. Install dependencies:
```bash
npm install
```

5. Start the development server:
```bash
npm run dev
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

## Example Usage

```typescript
import { useAuth, createDocument, uploadFile } from '@/utils/firebase';

// Authentication
const { user, loading } = useAuth();

// Create a document
await createDocument('users', user.uid, {
  name: 'John Doe',
  email: user.email
});

// Upload a file
const fileUrl = await uploadFile('images/profile.jpg', fileObject);
```

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
