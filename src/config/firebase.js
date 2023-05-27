import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const config = {
  apiKey: 'AIzaSyAg58DlC0B_XJAUH5ukgdvC1q0XIZ6M4i0',
  authDomain: 'vue3-forum-7688c.firebaseapp.com',
  projectId: 'vue3-forum-7688c',
  storageBucket: 'vue3-forum-7688c.appspot.com',
  messagingSenderId: '909807157313',
  appId: '1:909807157313:web:65a6db13258ebaa0f046c0',
};

export const firebaseApp = initializeApp(config);
export const storage = getStorage(firebaseApp);
export const db = getFirestore(firebaseApp);
