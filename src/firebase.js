import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const app = firebase.initializeApp({
  apiKey: "AIzaSyCyy-KUJyc6zQNg3ov8dOHjsoqOxXrpFzQ",
  authDomain: "auth-development-6bbac.firebaseapp.com",
  projectId: "auth-development-6bbac",
  storageBucket: "auth-development-6bbac.appspot.com",
  messagingSenderId: "1005956715345",
  appId: "1:1005956715345:web:60a4b2c78408d46f4cf970",
});
export const auth = app.auth();
export const db = app.firestore();
export default app;
