import { renderHook, waitFor } from '@testing-library/react';
import {
  useAuth,
  signIn,
  signUp,
  logOut,
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  uploadFile,
  deleteFile
} from '../firebase';
import { Auth, User } from 'firebase/auth';

// Create mock implementations
const mockAuth = {
  currentUser: null,
  settings: {},
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn()
};

const mockFirestore = {
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn()
};

const mockStorage = {
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn()
};

// Mock Firebase modules
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => mockAuth),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return () => {};
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => mockFirestore),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn()
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => mockStorage),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn()
}));

// Mock Firebase config
jest.mock('../../config/firebase.config', () => ({
  auth: mockAuth,
  db: mockFirestore,
  storage: mockStorage
}));

describe('Firebase Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAuth', () => {
    it('should return initial auth state', async () => {
      mockAuth.onAuthStateChanged.mockImplementation((callback) => {
        callback(null);
        return () => {};
      });

      const { result } = renderHook(() => useAuth());
      
      // Initially loading should be true
      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();

      // Wait for the auth state to be checked
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should update auth state when user changes', async () => {
      const mockUser = { uid: '123', email: 'test@example.com' } as User;
      mockAuth.onAuthStateChanged.mockImplementation((callback) => {
        callback(mockUser);
        return () => {};
      });

      const { result } = renderHook(() => useAuth());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.user).toEqual(mockUser);
      });
    });
  });

  describe('Auth Functions', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const mockUser = { uid: '123', email } as User;

    it('should sign in user', async () => {
      mockAuth.signInWithEmailAndPassword.mockImplementation(() => 
        Promise.resolve({ user: mockUser })
      );

      const user = await signIn(email, password);
      expect(mockAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, email, password);
      expect(user).toEqual(mockUser);
    });

    it('should sign up user', async () => {
      mockAuth.createUserWithEmailAndPassword.mockImplementation(() => 
        Promise.resolve({ user: mockUser })
      );

      const user = await signUp(email, password);
      expect(mockAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, email, password);
      expect(user).toEqual(mockUser);
    });

    it('should log out user', async () => {
      await logOut();
      expect(mockAuth.signOut).toHaveBeenCalled();
    });
  });

  describe('Firestore Functions', () => {
    const mockData = { name: 'Test', value: 123 };
    const collectionName = 'test-collection';
    const docId = 'test-doc';

    it('should create document', async () => {
      mockFirestore.setDoc.mockImplementation(() => Promise.resolve());

      await createDocument(collectionName, docId, mockData);
      expect(mockFirestore.setDoc).toHaveBeenCalled();
    });

    it('should get document', async () => {
      mockFirestore.getDoc.mockImplementation(() => 
        Promise.resolve({
          exists: () => true,
          data: () => mockData
        })
      );

      const result = await getDocument(collectionName, docId);
      expect(mockFirestore.getDoc).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should update document', async () => {
      mockFirestore.updateDoc.mockImplementation(() => Promise.resolve());

      await updateDocument(collectionName, docId, mockData);
      expect(mockFirestore.updateDoc).toHaveBeenCalled();
    });

    it('should delete document', async () => {
      mockFirestore.deleteDoc.mockImplementation(() => Promise.resolve());

      await deleteDocument(collectionName, docId);
      expect(mockFirestore.deleteDoc).toHaveBeenCalled();
    });
  });

  describe('Storage Functions', () => {
    const path = 'test/file.jpg';
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockUrl = 'https://example.com/test.jpg';

    it('should upload file', async () => {
      mockStorage.uploadBytes.mockImplementation(() => Promise.resolve());
      mockStorage.getDownloadURL.mockImplementation(() => Promise.resolve(mockUrl));

      const url = await uploadFile(path, mockFile);
      expect(mockStorage.uploadBytes).toHaveBeenCalled();
      expect(mockStorage.getDownloadURL).toHaveBeenCalled();
      expect(url).toBe(mockUrl);
    });

    it('should delete file', async () => {
      mockStorage.deleteObject.mockImplementation(() => Promise.resolve());

      await deleteFile(path);
      expect(mockStorage.deleteObject).toHaveBeenCalled();
    });
  });
});
