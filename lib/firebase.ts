import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAsqHcv69rm38JfCa9EmGDluIOoEVnbI5o",
  authDomain: "pulsey-ai.firebaseapp.com",
  projectId: "pulsey-ai",
  storageBucket: "pulsey-ai.firebasestorage.app",
  messagingSenderId: "485986138864",
  appId: "1:485986138864:web:85c2182d3a105a766d6035",
  measurementId: "G-P2B8RN6MWH"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
