import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBxhR9KaanelF92QP39pxkGSdKn6xRmREg",
  authDomain: "hireflow-98a08.firebaseapp.com",
  projectId: "hireflow-98a08",
  storageBucket: "hireflow-98a08.firebasestorage.app",
  messagingSenderId: "428125255965",
  appId: "1:428125255965:web:9f7cbb2f6269c4e16b89f4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);