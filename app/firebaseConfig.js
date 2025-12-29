// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Firestore
import { getStorage } from "firebase/storage"; // ✅ Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_IGeIB890MDiB1CHrFauyqHNfFzsm1-M",
  authDomain: "blogginappposts.firebaseapp.com",
  projectId: "blogginappposts",
  storageBucket: "blogginappposts.firebasestorage.app",
  messagingSenderId: "212857539314",
  appId: "1:212857539314:web:f11220da82fd65ff8b1e6b",
  measurementId: "G-D65EBV0BCD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Providers
export const googleProvider = new GoogleAuthProvider();

// Auth
export const auth = getAuth(app);

// Firestore (Banco de Dados)
export const db = getFirestore(app);

// Storage (para upload de imagens/arquivos)
export const storage = getStorage(app);

export default app;