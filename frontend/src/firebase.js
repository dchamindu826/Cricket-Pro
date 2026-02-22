import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtcAmK6wJ_sHvw8TGlnwEYXPbQBZPE0Vk",
  authDomain: "cricket-pro-75594.firebaseapp.com",
  projectId: "cricket-pro-75594",
  storageBucket: "cricket-pro-75594.firebasestorage.app",
  messagingSenderId: "683364770023",
  appId: "1:683364770023:web:76e08fb81f73562e27c242",
  measurementId: "G-VGX30VZTT2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();