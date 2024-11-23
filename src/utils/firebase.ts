import { useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../config/firebase.config';

// Auth hooks
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};

// Auth functions
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Firestore functions
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data);
  } catch (error) {
    throw error;
  }
};

export const getDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : null;
  } catch (error) {
    throw error;
  }
};

export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data as DocumentData);
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    throw error;
  }
};

export const queryDocuments = async <T extends DocumentData>(
  collectionName: string,
  field: string,
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=',
  value: any
): Promise<(T & { id: string })[]> => {
  try {
    const q = query(collection(db, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as T)
    }));
  } catch (error) {
    throw error;
  }
};

// Storage functions
export const uploadFile = async (
  path: string,
  file: File
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    throw error;
  }
};
