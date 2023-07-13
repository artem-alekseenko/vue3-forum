import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const config = {
  apiKey: import.meta.env.VITE_VUE_APP_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_VUE_APP_FIREBASE_PROJECT_ID,
  authDomain: import.meta.env.VITE_VUE_APP_FIREBASE_AUTH_DOMAIN,
  storageBucket: import.meta.env.VITE_VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_VUE_APP_FIREBASE_APP_ID,
};

export const firebaseApp = initializeApp(config);
export const storage = getStorage(firebaseApp);
export const db = getFirestore(firebaseApp);
