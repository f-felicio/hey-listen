import * as firebase from "firebase";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiWnjeijhlHMEKKrR0KHmTefjHBZWzu0I",
  authDomain: "teste-1987.firebaseapp.com",
  databaseURL: "https://teste-1987.firebaseio.com",
  storageBucket: "teste-1987.appspot.com",
  projectId: "teste-1987"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export default firebase;
