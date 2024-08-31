// initializeApp
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
// authentication 
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
// firestore data base 
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
// firebase cloud storage 
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";

// firebase app config 
const firebaseConfig = {
  apiKey: "AIzaSyAvTYAmWlVIj8Jfl2or7rruBGLWmmr9Tns",
  authDomain: "blogging-hackathon.firebaseapp.com",
  projectId: "blogging-hackathon",
  storageBucket: "blogging-hackathon.appspot.com",
  messagingSenderId: "392281080594",
  appId: "1:392281080594:web:96209689921a92594529cb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// auth initialize
const auth = getAuth(app);
// firestore initialize
const db = getFirestore(app);
// cloudstorage initialize
const storage = getStorage(app);

// export all value 
export {
  storage,
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  uploadBytesResumable,
  ref,
  getDownloadURL,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
};
