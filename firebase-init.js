import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjj-xYOa7KJbOYTmhaPeXR8hPU6Y_bUKM",
  authDomain: "moviemate-d32df.firebaseapp.com",
  databaseURL: "https://moviemate-d32df-default-rtdb.firebaseio.com",
  projectId: "moviemate-d32df",
  storageBucket: "moviemate-d32df.appspot.com",
  messagingSenderId: "694293083152",
  appId: "1:694293083152:web:8e5ee223384c5fb159c695",
  measurementId: "G-79QL6DF8V0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage, GoogleAuthProvider };