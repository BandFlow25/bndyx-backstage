// src/lib/firebase/index.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import type { FirebaseStorage as Storage } from 'firebase/storage';

// Singleton instances
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: Storage;

/**
 * Initialize Firebase client SDK for bndy-core
 * This ensures we have a single instance of Firebase throughout the application
 */
export const initializeFirebase = () => {
  if (getApps().length === 0) {
    // Initialize Firebase with environment variables
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    
    // Firebase initialization with environment variables
    
    try {
      firebaseApp = initializeApp(firebaseConfig);
      // Firebase initialization successful
    } catch (error) {
      // Error handling silenced
      throw error;
    }
  } else {
    firebaseApp = getApps()[0];
  }
  
  // Initialize Auth, Firestore and Storage
  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);
  storage = getStorage(firebaseApp);
  
  return { firebaseApp, auth, firestore, storage };
};

/**
 * Get the Firebase Auth instance
 * Initializes Firebase if needed
 */
export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
};

/**
 * Get the Firestore instance
 * Initializes Firebase if needed
 */
export const getFirebaseFirestore = (): Firestore => {
  if (!firestore) {
    initializeFirebase();
  }
  return firestore;
};

/**
 * Get the Firebase Storage instance
 * Initializes Firebase if needed
 */
export const getFirebaseStorage = (): Storage => {
  if (!storage) {
    initializeFirebase();
  }
  return storage;
};

// Initialize Firebase by default
initializeFirebase();

// Export instances for use throughout the application
export { auth, firestore, storage, firebaseApp };
