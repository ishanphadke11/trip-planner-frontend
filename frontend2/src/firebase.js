// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDDbw3BPyrFDUE08zbJYM0Vn41VXDuQIiU",
  authDomain: "tripmaker-c1e73.firebaseapp.com",
  projectId: "tripmaker-c1e73",
  storageBucket: "tripmaker-c1e73.firebasestorage.app",
  messagingSenderId: "137274651666",
  appId: "1:137274651666:web:b8d3ffa6cd6c82bce8d4cb",
  measurementId: "G-EMFH2SDDBH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };