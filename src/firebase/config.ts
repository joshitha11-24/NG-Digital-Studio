import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Firestore 
} from 'firebase/firestore';

// User's provided Firebase configuration for project ng-digital-studio-e9b5e
export const firebaseConfig = {
  apiKey: "AIzaSyBJi-zMVHEWwLnjJzo5mh2THWRVT4tNrAI",
  authDomain: "ng-digital-studio-e9b5e.firebaseapp.com",
  projectId: "ng-digital-studio-e9b5e",
  storageBucket: "ng-digital-studio-e9b5e.firebasestorage.app",
  messagingSenderId: "585681729603",
  appId: "1:585681729603:web:886f176cc1af8534283cf6"
};

// Initialize Firebase App instance singleton
let appInstance: FirebaseApp;
let authInstance: Auth;
let dbInstance: Firestore;

try {
  appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  authInstance = getAuth(appInstance);
  dbInstance = getFirestore(appInstance);
} catch (error) {
  console.error("Firebase SDK initialization error:", error);
  // Safe fallbacks to prevent crash during builds
  appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
  authInstance = getAuth(appInstance);
  dbInstance = getFirestore(appInstance);
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;

// Designated admin emails that have elevated privileges
export const ADMIN_EMAILS = [
  'joshithasrinivasan277@gmail.com',
  'admin@ngdigitalstudio.com',
  'ng.digitalstudiomdu@gmail.com'
];

export const isUserAdmin = (user: User | { email?: string | null } | null): boolean => {
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase().trim());
};

/**
 * Perform secure verification of user admin authorization
 * Validates against authorized admin list and Firestore user role
 */
export const verifyAdminAuthorization = async (user: User | null): Promise<boolean> => {
  if (!user || !user.email) return false;
  const cleanEmail = user.email.toLowerCase().trim();
  if (ADMIN_EMAILS.includes(cleanEmail)) return true;

  try {
    const userDocRef = doc(dbInstance, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      if (data?.role === 'admin' || data?.role === 'STUDIO_ADMIN' || data?.role === 'SUPER_ADMIN') {
        return true;
      }
    }
  } catch (err) {
    console.warn('verifyAdminAuthorization check note:', err);
  }

  return false;
};

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
};

export type { User, Auth, Firestore };
