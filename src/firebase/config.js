// Firebase imports
import { initializeApp } from "firebase/app"; 
import { getFirestore } from "firebase/firestore"; // Firestore
import { getAuth } from "firebase/auth"; // Authentication
import { getStorage } from "firebase/storage"; // Storage (optional if you need file storage)
import { getAnalytics } from "firebase/analytics"; // Analytics (optional)

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyCSe_vhoaUv8lKKD6YM15GU3MlrLOdMGPg",
    authDomain: "react-c556a.firebaseapp.com",
    projectId: "react-c556a",
    storageBucket: "react-c556a.appspot.com",
    messagingSenderId: "797046677535",
    appId: "1:797046677535:web:66491cc9523fbc79b3f52a"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app); // Firestore database
const auth = getAuth(app); // Firebase authentication
const storage = getStorage(app); // Firebase storage (if needed)
const analytics = getAnalytics(app); // Firebase analytics (optional)

// Export services for use in the app
export { app, db, auth, storage, analytics };
