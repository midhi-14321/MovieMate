import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js"; // Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyCjj-xYOa7KJbOYTmhaPeXR8hPU6Y_bUKM",
  authDomain: "moviemate-d32df.firebaseapp.com",
  projectId: "moviemate-d32df",
  storageBucket: "moviemate-d32df.appspot.com",
  messagingSenderId: "694293083152",
  databaseURL: "https://moviemate-d32df-default-rtdb.firebaseio.com",
  appId: "1:694293083152:web:8e5ee223384c5fb159c695",
  measurementId: "G-79QL6DF8V0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); // Initialize Realtime Database

const handleGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in:", result.user); // Debugging
    window.location.href = "./main.html";
  } catch (error) {
    console.error("Error during sign-in:", error.message); // Debugging
  }
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded"); // Debugging

  // Initialize modals
  const signUpModal = new bootstrap.Modal(
    document.getElementById("getStarted")
  );
  const signInModal = new bootstrap.Modal(
    document.getElementById("signInModal")
  );

  // Handle Google Sign-In buttons
  const googleButtons = ["#googleConfigure", "#googleSignIn"];
  googleButtons.forEach((id) => {
    const button = document.querySelector(id);
    if (button) {
      button.addEventListener("click", handleGoogle);
    } else {
      console.error(`Button with ID ${id} not found`); // Debugging
    }
  });

  // Handle Sign Up
  const signUpButton = document.getElementById("signUp");
  if (signUpButton) {
    signUpButton.addEventListener("click", async function (event) {
      event.preventDefault();
      console.log("Sign Up button clicked"); // Debugging

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const emailPattern = /^[a-z\d]+@(gmail|yahoo|outlook)+\.(com|in|org|co)$/;
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$%&#@]).{8,16}$/;

      // Validation
      if (!username || !email || !password) {
        console.log("Validation failed: All fields are mandatory"); // Debugging
        alert("⚠️ All fields are mandatory!");
        return;
      }
      if (!emailPattern.test(email)) {
        console.log("Validation failed: Invalid email format"); // Debugging
        alert("⚠️ Invalid email format!");
        return;
      }
      if (!passwordPattern.test(password)) {
        console.log("Validation failed: Invalid password format"); // Debugging
        alert(
          "⚠️ Password must be 8-16 characters with uppercase, lowercase, a number & special character."
        );
        return;
      }

      try {
        // Firebase Sign Up
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log("User created:", user); // Debugging

        // Prepare user data for Realtime Database
        const userData = {
          username: username,
          email: email,
          createdAt: new Date().toISOString(),
        };

        // Write user data to Realtime Database
        console.log("Writing to Realtime Database:", userData); // Debugging
        await set(ref(db, `users/${user.uid}`), userData);

        console.log("User data stored in Realtime Database"); // Debugging
        alert("✅ Account created successfully!");

        // Close Sign Up modal and open Sign In modal
        signUpModal.hide();
        signInModal.show();

        // Pre-fill the email in the Sign In modal
        document.getElementById("Email").value = email;
      } catch (error) {
        console.error("Firebase error:", error); // Debugging

        // Handle specific errors
        if (error.code === "auth/email-already-in-use") {
          alert("❌ This email is already in use. Please log in instead.");
          signUpModal.hide();
          signInModal.show();
        } else {
          alert("❌ Error: " + error.message);
        }
      }
    });
  }
  // Handle Guest Login
  const guestButtons = ["#guestLogin", "#continueAsGuest"];
  guestButtons.forEach((id) => {
    const button = document.querySelector(id);
    if (button) {
      button.addEventListener("click", () => {
        console.log("Guest Login button clicked"); // Debugging
        signInAnonymously(auth)
          .then(() => {
            alert("You are now logged in as a Guest.");
            window.location.href = "./main.html";
          })
          .catch((error) => {
            alert("Error: " + error.message);
          });
      });
    }
  });

  // Handle Sign In
  const signInButton = document.getElementById("signIn");
  if (signInButton) {
    signInButton.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("Sign In button clicked"); // Debugging

      const email = document.getElementById("Email").value.trim();
      const password = document.getElementById("Password").value.trim();

      const emailPattern = /^[a-z\d]+@(gmail|yahoo|outlook)+\.(com|in|org|co)$/;
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$%&#@]).{8,16}$/;

      // Validation
      if (!email || !password) {
        console.log("Validation failed: Both Email and Password are required"); // Debugging
        alert("⚠️ Both Email and Password are required!");
        return;
      }
      if (!emailPattern.test(email)) {
        console.log("Validation failed: Invalid email format"); // Debugging
        alert("⚠️ Invalid email format!");
        return;
      }
      if (!passwordPattern.test(password)) {
        console.log("Validation failed: Invalid password format"); // Debugging
        alert(
          "⚠️ Password must be 8-16 characters with uppercase, lowercase, a number & special character."
        );
        return;
      }

      // Firebase Sign In
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log("User signed in successfully"); // Debugging
          alert("✅ Login successful!");
          signInModal.hide();
          window.location.href = "./main.html"; // Redirect to main page
        })
        .catch((error) => {
          console.error("Firebase error:", error); // Debugging
          if (error.code === "auth/user-not-found") {
            alert("❌ User not found. Please register first.");
          } else if (error.code === "auth/wrong-password") {
            alert("❌ Incorrect password. Please try again.");
          } else {
            alert("❌ An error occurred: " + error.message);
          }
        });
    });
  }

  // Switch between Sign Up and Sign In modals
  document
    .querySelector("#getStarted .btn-secondary")
    .addEventListener("click", () => {
      console.log("Switching to Sign In modal"); // Debugging
      signUpModal.hide();
      signInModal.show();
    });

  document
    .querySelector("#signInModal .btn-secondary")
    .addEventListener("click", () => {
      console.log("Switching to Sign Up modal"); // Debugging
      signInModal.hide();
      signUpModal.show();
    });
});
