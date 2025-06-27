// js/firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyBWlVw3NQjuEr77yQfNUWzpg-jb2K5YE6E",
  authDomain: "gamehub-project-fb643.firebaseapp.com",
  databaseURL: "https://gamehub-project-fb643-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gamehub-project-fb643",
  storageBucket: "gamehub-project-fb643.appspot.com",
  messagingSenderId: "38222999508",
  appId: "1:38222999508:web:f1c907ce29c22afcc53041"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
