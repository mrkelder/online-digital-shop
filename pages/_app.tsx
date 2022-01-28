import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "components/Layout";
import Firebase from "utils/firebase";
import { FirebaseContext } from "utils/firebase";
import { Provider } from "react-redux";
import { storeInitiator, epmtyStore } from "store/index";
import { useEffect, useState } from "react";

// FIXME: order imports

const firebase = new Firebase();

function MyApp({ Component, pageProps }: AppProps) {
  const [store, setStore] = useState(epmtyStore);

  // FIXME: replace localStorage with cookies

  useEffect(() => {
    const initiatedStore = storeInitiator();
    setStore(initiatedStore);
  }, []);

  return (
    <FirebaseContext.Provider value={firebase}>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </FirebaseContext.Provider>
  );
}

export default MyApp;
