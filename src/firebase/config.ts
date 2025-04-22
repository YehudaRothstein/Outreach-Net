import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYLxalxu0YMCKGR70IsCb4SmZCGmUNy_0",
  authDomain: "outreach-net.firebaseapp.com",
  projectId: "outreach-net",
  storageBucket: "outreach-net.firebasestorage.app",
  messagingSenderId: "400595989046",
  appId: "1:400595989046:web:b912d7a33099979d9a5e97",
  measurementId: "G-CFW5V4W5G6",
};

// Initialize Firebase
console.log("Initializing Firebase with config:", firebaseConfig);
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized successfully:", app);

// Declare analytics at the top level
export let analytics: ReturnType<typeof getAnalytics> | undefined;

// Initialize Analytics (only if supported)
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized successfully:", analytics);
    } else {
      console.warn("Firebase Analytics is not supported in this environment.");
    }
  })
  .catch((error) => {
    console.error("Error checking Analytics support:", error);
  });

// Initialize other Firebase services
export const auth = getAuth(app);
console.log("Firebase Auth initialized successfully:", auth);

export const db = getFirestore(app);
console.log("Firebase Firestore initialized successfully:", db);

export const storage = getStorage(app);
console.log("Firebase Storage initialized successfully:", storage);

console.log("Firebase initialization completed.");