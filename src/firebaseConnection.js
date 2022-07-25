import { FIREBASE_INFO } from "./env";
import firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'

let firebaseConfig = FIREBASE_INFO

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase