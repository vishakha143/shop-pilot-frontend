import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "onecart-5bfab.firebaseapp.com",
  projectId: "onecart-5bfab",
  storageBucket: "onecart-5bfab.firebasestorage.app",
  messagingSenderId: "322505372130",
  appId: "1:322505372130:web:00cc9b50ece7b957bcc9bb",
  measurementId: "G-BBJ58W7E99"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


export { auth, provider }

