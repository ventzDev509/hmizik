
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app"; 
import { getMessaging } from "firebase/messaging";
import type { Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBwCl__oZ2ilXheZE-21RaWeghyomJXvsM",
  authDomain: "hmizik-eddaa.firebaseapp.com",
  projectId: "hmizik-eddaa",
  storageBucket: "hmizik-eddaa.firebasestorage.app",
  messagingSenderId: "438498402375",
  appId: "1:438498402375:web:3dc3ef6de2a6c889d49162"
};


// Inisyalize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Ekspòte messaging pou React 
export const messaging: Messaging = getMessaging(app);