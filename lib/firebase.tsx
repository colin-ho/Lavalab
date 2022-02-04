import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBXd3zbEXOTjl9QIZiz8cL1rIUQIvM6M5A",
  authDomain: "lavalab-23235.firebaseapp.com",
  projectId: "lavalab-23235",
  storageBucket: "lavalab-23235.appspot.com",
  messagingSenderId: "882762476840",
  appId: "1:882762476840:web:799fe5bcdfdcf8e6cdf41d",
  measurementId: "G-BZN3S90Q8W"
};


if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
export const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;
