'use client';

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const hasValidConfig = Object.values(firebaseConfig).every(Boolean);
let firebaseApp: FirebaseApp | null = null;

function ensureFirebaseApp(): FirebaseApp | null {
  if (firebaseApp) {
    return firebaseApp;
  }

  if (typeof window === 'undefined' || !hasValidConfig) {
    if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && !hasValidConfig) {
      console.warn('Firebase client skipped initialization: missing NEXT_PUBLIC_FIREBASE_* env vars.');
    }
    return null;
  }

  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return firebaseApp;
}

export function getFirebaseAuth(): Auth | null {
  const app = ensureFirebaseApp();
  return app ? getAuth(app) : null;
}

export function getFirestoreDb(): Firestore | null {
  const app = ensureFirebaseApp();
  return app ? getFirestore(app) : null;
}
