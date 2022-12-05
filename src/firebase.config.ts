import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDD17nLDvz60Y3ITIWb-KcLFiK4Yp5yekU",
    authDomain: "private-chatbox.firebaseapp.com",
    projectId: "private-chatbox",
    storageBucket: "private-chatbox.appspot.com",
    messagingSenderId: "653439716418",
    appId: "1:653439716418:web:ca40901596289552bdf1db",
    measurementId: "G-RVEBYY2020"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app);
export const storage = getStorage(app)
export const db = getFirestore()