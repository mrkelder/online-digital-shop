import { createContext } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  Firestore,
  query,
  where,
  documentId
} from "firebase/firestore";
import {
  FirebaseStorage,
  getStorage,
  ref,
  getDownloadURL
} from "firebase/storage";

class Firebase {
  // TODO: fetch categories and subcategories once and cache them together
  // FIXME: rename _cache to something more clarified
  private readonly db: Firestore;
  private readonly storage: FirebaseStorage;
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
    const app = initializeApp(Firebase.firebaseConfig);
    this.db = getFirestore();
    this.storage = getStorage(app);
    this._cache = new Map();
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

  async getAllDocumentsInCollection<T>(collectionName: string) {
    let data: T[] = [];
    const querySnapshot = await getDocs(collection(this.db, collectionName));
    querySnapshot.forEach(doc =>
      data.push({ ...doc.data(), id: doc.id } as unknown as T)
    );
    return data;
  }

  async fetchDocumentsById(collectionName: string, ids: string[]) {
    const q = query(
      collection(this.db, collectionName),
      where(documentId(), "in", ids)
    );
    const queryResults = await getDocs(q);
    const parsedResults = queryResults.docs.map(
      doc =>
        ({
          ...doc.data(),
          id: doc.id
        } as Product)
    );
    return parsedResults;
  }

  async downloadFiles(directoryName: string, fileNames: string[]) {
    let files: Promise<string>[] = [];

    for (const i of fileNames) {
      const pathReference = ref(this.storage, directoryName + "/" + i);
      const downloadPromise = getDownloadURL(pathReference);
      files.push(downloadPromise);
    }

    return await Promise.all(files);
  }
}

const firebaseContext = createContext<Firebase>(new Firebase());
firebaseContext.displayName = "firebase";

export const FirebaseContext = firebaseContext;
export default Firebase;
