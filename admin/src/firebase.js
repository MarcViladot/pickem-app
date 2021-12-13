import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export const firebaseConfig = {
    apiKey: "AIzaSyCUu7iZr8ioZcFmhr3Zmqvhrai4_6_Ha40",
    authDomain: "pickem-app-2372f.firebaseapp.com",
    projectId: "pickem-app-2372f",
    storageBucket: "pickem-app-2372f.appspot.com",
    messagingSenderId: "1097082691734",
    appId: "1:1097082691734:web:174262d247cbf00d9a62b7",
    measurementId: "G-E89TS0RYBG"
};

firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebase.auth();
