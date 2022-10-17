import { FIREBASE_INFO } from "./env";
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

let firebaseConfig = FIREBASE_INFO

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)

export { db }