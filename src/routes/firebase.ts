import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiENcxN4gP4fsJ6SnhtDHe7Uk6AhIh0QQ",
  authDomain: "titter-clone.firebaseapp.com",
  projectId: "titter-clone",
  storageBucket: "titter-clone.appspot.com",
  messagingSenderId: "297739547420",
  appId: "1:297739547420:web:d1f8012ac6ab56ee9c40d9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
