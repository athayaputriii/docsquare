// firebaseAdmin.js
import admin from 'firebase-admin';
import {
  FIREBASE_APP_NAME,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CREDENTIALS_PRESENT,
  FIREBASE_DATABASE_URL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID,
} from './config.js';

let firebaseApp = null;

function ensureFirebaseCredentials() {
  if (FIREBASE_CREDENTIALS_PRESENT) {
    return true;
  }

  const missing = [
    ['FIREBASE_PROJECT_ID', FIREBASE_PROJECT_ID],
    ['FIREBASE_CLIENT_EMAIL', FIREBASE_CLIENT_EMAIL],
    ['FIREBASE_PRIVATE_KEY', FIREBASE_PRIVATE_KEY],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  throw new Error(
    `Firebase Admin credentials are missing. Define ${missing.join(', ')} in your environment.`,
  );
}

export function getFirebaseApp() {
  if (firebaseApp) {
    return firebaseApp;
  }

  ensureFirebaseCredentials();

  const existingApp = admin.apps.find((app) => app?.name === FIREBASE_APP_NAME);
  if (existingApp) {
    firebaseApp = existingApp;
    return firebaseApp;
  }

  firebaseApp = admin.initializeApp(
    {
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
      }),
      databaseURL: FIREBASE_DATABASE_URL,
    },
    FIREBASE_APP_NAME,
  );

  return firebaseApp;
}

export function getFirestore() {
  const app = getFirebaseApp();
  return admin.firestore(app);
}

export function getAuth() {
  const app = getFirebaseApp();
  return admin.auth(app);
}
