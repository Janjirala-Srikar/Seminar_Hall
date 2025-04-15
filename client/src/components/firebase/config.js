// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc7SGt6vMAEClxHsPXOe77n5UMHRUvYBo",
  authDomain: "seminarhall-c1280.firebaseapp.com",
  projectId: "seminarhall-c1280",
  storageBucket: "seminarhall-c1280.firebasestorage.app",
  messagingSenderId: "1019317812425",
  appId: "1:1019317812425:web:ab4314fec649173e54a118",
  measurementId: "G-L59FVKDYT0"
};

// Initialize Firebase - do this only once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };