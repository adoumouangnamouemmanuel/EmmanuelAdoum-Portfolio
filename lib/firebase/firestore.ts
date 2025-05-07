import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Initialize Firebase with environment variables or fallback values for development
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-app.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Log Firebase initialization
console.log("Initializing Firebase with config:", {
  apiKey: firebaseConfig.apiKey ? "***" : "NOT SET",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId ? "***" : "NOT SET",
  appId: firebaseConfig.appId ? "***" : "NOT SET",
});

// Initialize Firebase
let app;
let db;
let auth;

try {
  // Check if Firebase is already initialized
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  } else {
    app = getApp();
    console.log("Using existing Firebase app");
  }

  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);

  // Create mock implementations for development/testing
  if (process.env.NODE_ENV === "development") {
    console.warn("Using mock Firebase implementation for development");

    // This is just to prevent errors when Firebase isn't properly configured
    db = {} as any;
    auth = {} as any;
  } else {
    throw error;
  }
}

// Helper function to convert Firestore timestamp to ISO string
const convertTimestampToISO = (timestamp: Timestamp) => {
  return timestamp.toDate().toISOString();
};

// Helper function to convert Firestore document to a plain object
const convertDocToObject = <T extends { id: string }>(
  doc: QueryDocumentSnapshot<DocumentData>
): T => {
  const data = doc.data();
  const result: any = { id: doc.id, ...data };

  // Convert all Timestamp objects to ISO strings
  Object.keys(result).forEach((key) => {
    if (result[key] instanceof Timestamp) {
      result[key] = convertTimestampToISO(result[key]);
    }
  });

  return result as T;
};

export {
  db,
  auth,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  convertDocToObject,
};
