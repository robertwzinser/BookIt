// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_uX33ajqsMKAfp7LeP9u57AdBfcuQW2w",
  authDomain: "bookit-v2.firebaseapp.com",
  projectId: "bookit-v2",
  storageBucket: "bookit-v2.appspot.com",
  messagingSenderId: "24786135640",
  appId: "1:24786135640:web:a10a629de292aa2b97f82d",
  measurementId: "G-HHRKZL7JJR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);