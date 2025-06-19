// src/config/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDRlMNKL27by9k3Fb2iXia9aHLI1WRAoHA",
  authDomain: "merkagrama-crm.firebaseapp.com",
  projectId: "merkagrama-crm",
  storageBucket: "merkagrama-crm.firebasestorage.app",
  messagingSenderId: "24200387789",
  appId: "1:24200387789:web:4420aee28194b353e59d84",
  measurementId: "G-KWZBGZ7CEB"
}

// Inicializa Firebase
const app = initializeApp(firebaseConfig)

// Exporta la instancia de Firestore
export const db = getFirestore(app)
