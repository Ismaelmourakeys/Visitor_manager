import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyByuUeW8O4JIRTJQlAdvKHxpFv8HTMhnIE",
  authDomain: "visitchurch-e8d9a.firebaseapp.com",
  projectId: "visitchurch-e8d9a",
  storageBucket: "visitchurch-e8d9a.firebasestorage.app",
  messagingSenderId: "924364730507",
  appId: "1:924364730507:web:258d8815a595987ba7e48e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();