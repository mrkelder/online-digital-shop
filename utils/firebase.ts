import { createContext } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  Firestore,
  query,
  where
} from "firebase/firestore";

class Firebase {
  // TODO: fetch categories and subcategories once and cache them together
  private readonly db: Firestore;
  readonly _cache: Map<string, SubCategory[]>;

  static firebaseConfig = {
    apiKey: "AIzaSyBrHoU08YA0Q7lBEAWyc9Ld4Fze0R_O8w4",
    authDomain: "new-london-8d2c3.firebaseapp.com",
    projectId: "new-london-8d2c3",
    storageBucket: "new-london-8d2c3.appspot.com",
    messagingSenderId: "173083750309",
    appId: "1:173083750309:web:b7fadcf6afdd79e257c24c",
    measurementId: "G-SSZS19QCH8"
  };

  constructor() {
    initializeApp(Firebase.firebaseConfig);
    this.db = getFirestore();
    this._cache = new Map();
  }

  async getCategories() {
    let data: Category[] = [];
    const querySnapshot = await getDocs(collection(this.db, "categories"));
    querySnapshot.forEach(doc =>
      data.push({ ...doc.data(), id: doc.id } as Category)
    );
    return data;
  }

  async getSubCategories(categoryId: string) {
    if (this._cache.has(categoryId)) {
      return this._cache.get(categoryId) as SubCategory[];
    } else {
      let data: SubCategory[] = [];
      const q = query(
        collection(this.db, "subcategories"),
        where("category", "==", categoryId)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc =>
        data.push({ ...doc.data(), id: doc.id } as SubCategory)
      );

      this._cache.set(categoryId, data);
      return data;
    }
  }
}

const firebaseContext = createContext<Firebase>(new Firebase());
firebaseContext.displayName = "firebase";

export const FirebaseContext = firebaseContext;
export default Firebase;
