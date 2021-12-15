import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "components/Layout";
import Firebase from "utils/firebase";
import { FirebaseContext } from "utils/firebase";

const firebase = new Firebase();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseContext.Provider value={firebase}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </FirebaseContext.Provider>
  );
}

export default MyApp;
