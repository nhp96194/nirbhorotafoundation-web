// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3nMpVQfivLgut2wBQaUYWllM52lBmZKw",
  authDomain: "nirbhorotafoundationorg.firebaseapp.com",
  projectId: "nirbhorotafoundationorg",
  storageBucket: "nirbhorotafoundationorg.firebasestorage.app",
  messagingSenderId: "821416126156",
  appId: "1:821416126156:web:56a3d002e3dc5457da4469",
  measurementId: "G-YTZKG3WQXH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);