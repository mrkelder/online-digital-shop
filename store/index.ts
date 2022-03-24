import { combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { CART, CHECKOUT } from "constants/localstorage-names";
import { DEFAULT_CART_STATE, DEFAULT_CHECKOUT_STATE } from "constants/redux";
import { CartState } from "types/cart-reducer";
import { CheckoutState } from "types/checkout";
import { ReduxStore, StoreState } from "types/store";
import LocalStorage from "utils/LocalStorage";

import cartReducer from "./reducers/cartReducer";
import checkoutReducer from "./reducers/checkoutReducer";

const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer
});

const composedEnhancers = composeWithDevTools();

export const epmtyStore: ReduxStore = createStore(rootReducer);

export function storeInitiator(): ReduxStore {
  const preloadedStore: StoreState = {
    cart: DEFAULT_CART_STATE,
    checkout: DEFAULT_CHECKOUT_STATE
  };

  try {
    const preloadedCartItems: CartState["items"] = JSON.parse(
      LocalStorage.getItem(CART) ?? "[]"
    );

    const preloadedCheckoutData: CheckoutState = JSON.parse(
      LocalStorage.getItem(CHECKOUT) ?? JSON.stringify(DEFAULT_CHECKOUT_STATE)
    );

    preloadedStore.cart.items = preloadedCartItems.map(i =>
      i.quantity >= 1 ? i : { ...i, quantity: 1 }
    );

    preloadedStore.checkout = preloadedCheckoutData;
  } catch {
    LocalStorage.removeItem(CART);
    LocalStorage.removeItem(CHECKOUT);
  }

  const store = createStore(rootReducer, preloadedStore, composedEnhancers);
  return store;
}

export type RootStore = ReturnType<typeof rootReducer>;
