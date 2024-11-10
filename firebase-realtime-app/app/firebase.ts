// app/firebase.ts
// Importa las funciones que necesitas de los SDKs que necesitas
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase para la aplicación web
const firebaseConfig = {
  apiKey: "AIzaSyBF-FpxJhqg12gJ9BhPlb3WSj9TJW7ALZs", // Nueva configuración
  authDomain: "acceso-remoto-a-base-de-datos.firebaseapp.com",
  projectId: "acceso-remoto-a-base-de-datos",
  storageBucket: "acceso-remoto-a-base-de-datos.firebasestorage.app",
  messagingSenderId: "1087454179829",
  appId: "1:1087454179829:web:f22886ee70b8faff2ab0bc",
  measurementId: "G-CMZL2VXE8B" // Nueva propiedad
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);