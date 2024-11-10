// app/firebase.ts
// Importa las funciones que necesitas de los SDKs que necesitas
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase para la aplicación web
const firebaseConfig = {
  apiKey: "apiKey",
  authDomain: "acceso-remoto-a-base-de-b9bdd.firebaseapp.com",
  projectId: "acceso-remoto-a-base-de-b9bdd",
  storageBucket: "acceso-remoto-a-base-de-b9bdd.firebasestorage.app",
  messagingSenderId: "85610040959",
  appId: "1:85610040959:web:93dbc4ff890a3d8026394a",
  measurementId: "G-BSHY1CNPFN" // Nueva propiedad
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Exportar Firestore