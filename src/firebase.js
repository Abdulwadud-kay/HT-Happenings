
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyBttjo4Ep3X43NEAmlOUF4zLxo1QcQqglQ",
  authDomain: "ht-happenings.firebaseapp.com",
  projectId: "ht-happenings",
  storageBucket: "ht-happenings.appspot.com",
  messagingSenderId: "31783161950",
  appId: "1:31783161950:web:9777ebe62eb1e5e10be4cf",
  measurementId: "G-4D7LJKDQWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const Analytics = getAnalytics(app);
export const firestore = getFirestore(app)
const auth = getAuth(app)

export { auth }
export { Analytics }