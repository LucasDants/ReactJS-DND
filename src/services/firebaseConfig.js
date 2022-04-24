import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAg-4PoolwOruH3G4WjaiFsSRUUDT-q0zI",
  authDomain: "todolist-vibbra.firebaseapp.com",
  projectId: "todolist-vibbra",
  storageBucket: "todolist-vibbra.appspot.com",
  messagingSenderId: "984861247424",
  appId: "1:984861247424:web:3f7bc0e35b21598fec6a25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
