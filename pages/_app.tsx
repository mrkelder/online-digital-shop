import "../styles/globals.css";
import { useEffect, useState } from "react";

import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import Layout from "components/Layout";
import { storeInitiator, epmtyStore } from "store/index";
import cookieInitiator from "utils/Cookie/cookieInitiator";

function MyApp({ Component, pageProps }: AppProps) {
  const [store, setStore] = useState(epmtyStore);

  useEffect(() => {
    const initiatedStore = storeInitiator();
    cookieInitiator(initiatedStore);
    setStore(initiatedStore);
  }, []);

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
