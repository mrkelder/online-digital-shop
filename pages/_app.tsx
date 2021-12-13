import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "components/Layout";
import { createContext } from "react";
import Firebase from "utils/firebase";

function MyApp({ Component, pageProps }: AppProps) {
  const firebase = new Firebase();
  const FirebaseContext = createContext<Firebase>(firebase);
  FirebaseContext.displayName = "firebase";

  return (
    <FirebaseContext.Provider value={firebase}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </FirebaseContext.Provider>
  );
}

export default MyApp;
