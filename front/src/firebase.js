import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCmC8jAo0ZctD8Z5iLbCtZ7_pGwGIpEbQ4",
    authDomain: "breadsticks-de840.firebaseapp.com",
    projectId: "breadsticks-de840",
    storageBucket: "breadsticks-de840.appspot.com",
    messagingSenderId: "1007944052536",
    appId: "1:1007944052536:web:7c429f423b63fc6e0a5bcd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);