import { AMOUNT_OF_ITEMS_IN_CART } from "constants/cookie-names";
import { ReduxStore } from "types/store";

import Cookie from ".";

export default function cookieInitiator(store: ReduxStore) {
  Cookie.setCookie(
    AMOUNT_OF_ITEMS_IN_CART,
    store.getState().cart.items.length.toString()
  );
}
