// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9aQ1Kw3lyrgAsgBwAyec5CW-UGOuljuQ",
  authDomain: "smart-attendance-1e9eb.firebaseapp.com",
  projectId: "smart-attendance-1e9eb",
  storageBucket: "smart-attendance-1e9eb.firebasestorage.app",
  messagingSenderId: "449800226801",
  appId: "1:449800226801:web:327c658a7a0177949ca650",
  measurementId: "G-T93PLN8T5S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export {app, auth};