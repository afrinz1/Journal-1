// firebase.js
// Firebase configuration and initialization for Momentum Journal

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcfXCdKmJzMM8yMVhxkCgSH7RpAXJ1Xuk",
  authDomain: "journal-10.firebaseapp.com",
  projectId: "journal-10",
  storageBucket: "journal-10.appspot.com",
  messagingSenderId: "384182767648",
  appId: "1:384182767648:web:6879cceca99b6d66ff2c45",
  measurementId: "G-XWNRTJ4TWZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Analytics (optional)
if (typeof firebase.analytics === "function") {
  firebase.analytics();
}
