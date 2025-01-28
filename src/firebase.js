import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBromYwG7WZa8zmd6HNUq4CapeGBFVvLyc",
    authDomain: "project-management-8f752.firebaseapp.com",
    projectId: "project-management-8f752",
    storageBucket: "project-management-8f752.firebasestorage.app",
    messagingSenderId: "226521524276",
    appId: "1:226521524276:web:9ff53438fb338fdfe58261",
    databaseURL:"https://project-management-8f752-default-rtdb.firebaseio.com/"
  };

  export const app= initializeApp(firebaseConfig)

  export const db = getFirestore(app);