import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDMmreeLrOyqsigMcYPAAXN5eE-1C51R7o",
  authDomain: "errorcar-6df8f.firebaseapp.com",
  projectId: "errorcar-6df8f",
  storageBucket: "errorcar-6df8f.firebasestorage.app",
  messagingSenderId: "883524994447",
  appId: "1:883524994447:web:d2810e511743f0ea60b7fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)