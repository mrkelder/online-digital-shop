import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "components/Layout";
import Firebase from "utils/firebase";
import { FirebaseContext } from "utils/firebase";
import { Provider } from "react-redux";
import store from "store/index";

// FIXME: order imports

const firebase = new Firebase();

function MyApp({ Component, pageProps }: AppProps) {
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
