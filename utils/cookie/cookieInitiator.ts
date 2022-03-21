import { ReduxStore } from "store";

import Cookie from "./";
import { AMOUNT_OF_ITEMS_IN_CART } from "./cookieNames";

const cookie = new Cookie();

export default function cookieInitiator(store: ReduxStore) {
  cookie.setCookie(
    AMOUNT_OF_ITEMS_IN_CART,
    store.getState().cart.items.length.toString()
  );
}
