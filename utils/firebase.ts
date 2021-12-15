import { createContext } from "react";
import { initializeApp } from "firebase/app";

class Firebase {
  static firebaseConfig = {
    apiKey: "AIzaSyBrHoU08YA0Q7lBEAWyc9Ld4Fze0R_O8w4",
    authDomain: "new-london-8d2c3.firebaseapp.com",
    projectId: "new-london-8d2c3",
    storageBucket: "new-london-8d2c3.appspot.com",
    messagingSenderId: "173083750309",
    appId: "1:173083750309:web:b7fadcf6afdd79e257c24c",
    measurementId: "G-SSZS19QCH8"
  };

  init() {
    const app = initializeApp(Firebase.firebaseConfig);
    return app;
  }
}

const firebaseContext = createContext<Firebase>(new Firebase());
firebaseContext.displayName = "firebase";

export const FirebaseContext = firebaseContext;
export default Firebase;
