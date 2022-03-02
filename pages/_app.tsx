import "../styles/globals.css";
import { useEffect, useState } from "react";

import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import Layout from "components/Layout";
import { storeInitiator, epmtyStore } from "store/index";
import cookieInitiator from "utils/cookie/cookieInitiator";
import Firebase from "utils/firebase";
import { FirebaseContext } from "utils/firebase";

// FIXME: order imports

const firebase = new Firebase();

function MyApp({ Component, pageProps }: AppProps) {
  const [store, setStore] = useState(epmtyStore);

  useEffect(() => {
    const initiatedStore = storeInitiator();
    cookieInitiator(initiatedStore);
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
