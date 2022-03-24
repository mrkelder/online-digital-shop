import { ReduxStore } from "store";

import Cookie from ".";
import { AMOUNT_OF_ITEMS_IN_CART } from "./cookieNames";

export default function cookieInitiator(store: ReduxStore) {
  Cookie.setCookie(
    AMOUNT_OF_ITEMS_IN_CART,
    store.getState().cart.items.length.toString()
  );
}
