import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDBijv2EADoLn75ss47AYKTvdJS66BZF6c",
  authDomain: "instaapp-25839.firebaseapp.com",
  projectId: "instaapp-25839",
  storageBucket: "instaapp-25839.appspot.com",
  messagingSenderId: "605639277911",
  appId: "1:605639277911:web:80f1932521df7adb58d212"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };