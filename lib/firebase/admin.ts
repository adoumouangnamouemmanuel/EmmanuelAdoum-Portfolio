import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin only when its credentials are configured.
// Throwing at import time breaks `next build` (it imports every API route
// while collecting page data), e.g. on Vercel preview builds that have no
// Firebase variables. Requests still fail loudly if Admin is used unconfigured.
const configured = Boolean(
  process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY,
);

if (configured && !getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    throw error;
  }
} else if (!configured) {
  console.warn('Firebase Admin SDK not initialized: missing required environment variables');
}

const notConfigured = new Proxy({} as Firestore, {
  get() {
    throw new Error('Missing required Firebase Admin environment variables');
  },
});

export const adminDb: Firestore = configured ? getFirestore() : notConfigured;
