import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "components/Layout";
import Firebase from "utils/firebase";
import { FirebaseContext } from "utils/firebase";

function MyApp({ Component, pageProps }: AppProps) {
  const firebase = new Firebase();

  return (
    <FirebaseContext.Provider value={firebase}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </FirebaseContext.Provider>
  );
}

export default MyApp;
