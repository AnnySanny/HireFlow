import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDBE2SBFD8BTBY4G3CV-xA245VdO78Wdfw",
  authDomain: "moodbloom-ddf02.firebaseapp.com",
  projectId: "moodbloom-ddf02",
  storageBucket: "moodbloom-ddf02.firebasestorage.app",
  messagingSenderId: "173344927093",
  appId: "1:173344927093:web:f0610ca4001eee4a3bf73c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);