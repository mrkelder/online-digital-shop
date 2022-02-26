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
  private readonly db: Firestore;
  private readonly storage: FirebaseStorage;

  static firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
  };

  constructor() {
    const app = initializeApp(Firebase.firebaseConfig);
    this.db = getFirestore();
    this.storage = getStorage(app);
  }

  async getAllDocumentsInCollection<T>(collectionName: string) {
    let data: T[] = [];
    const querySnapshot = await getDocs(collection(this.db, collectionName));
    querySnapshot.forEach(doc =>
      data.push({ ...doc.data(), id: doc.id } as unknown as T)
    );
    return data;
  }

  async getDocumentsById<T>(collectionName: string, ids: string[]) {
    const queryObj: QueryObject = {
      field: documentId(),
      condition: "in",
      value: ids
    };
    return this.getDocumentsByQuery<T>(collectionName, [queryObj]);
  }

  async getDocumentsByQuery<T>(
    directoryName: string,
    queryObjetctsArray: QueryObject[]
  ) {
    const w = [];
    for (const q of queryObjetctsArray) {
      w.push(where(q.field, q.condition, q.value));
    }
    const q = query(collection(this.db, directoryName), ...w);
    const queryResults = await getDocs(q);
    const parsedResults = queryResults.docs.map(
      doc =>
        ({
          ...doc.data(),
          id: doc.id
        } as unknown as T)
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
