// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeAuth,getReactNativePersistence} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9TMLv2ixLavrP5k2pM9qDxGmhnqy63uo",
  authDomain: "safewalk-e1304.firebaseapp.com",
  projectId: "safewalk-e1304",
  storageBucket: "safewalk-e1304.firebasestorage.app",
  messagingSenderId: "722989901447",
  appId: "1:722989901447:web:2cd673ff244ce6d88e3a22",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export default app;