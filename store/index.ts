import { combineReducers, createStore, Store, EmptyObject } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import LocalStorage from "utils/localStorage/localStorage";

import { CART, CHECKOUT } from "../utils/localStorage/localStorageNames";
import {
  CartState,
  CartActions,
  DEFAULT_CART_STATE
} from "./reducers/cartReducer";
import cartReducer from "./reducers/cartReducer";
import checkoutReducer, {
  CheckoutActions,
  CheckoutState,
  DEFAULT_CHECKOUT_STATE
} from "./reducers/checkoutReducer";

export type ReduxStore = Store<
  EmptyObject & {
    cart: CartState;
    checkout: CheckoutState;
  },
  CartActions | CheckoutActions
>;

interface StoreState {
  cart: CartState;
  checkout: CheckoutState;
}

const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer
});

const composedEnhancers = composeWithDevTools();

export const epmtyStore: ReduxStore = createStore(rootReducer);

export function storeInitiator(): ReduxStore {
  const localStoragClass = new LocalStorage();
  const preloadedStore: StoreState = {
    cart: DEFAULT_CART_STATE,
    checkout: DEFAULT_CHECKOUT_STATE
  };

  try {
    const preloadedCartItems: CartState["items"] = JSON.parse(
      localStoragClass.getItem(CART) ?? "[]"
    );

    const preloadedCheckoutData: CheckoutState = JSON.parse(
      localStoragClass.getItem(CHECKOUT) ??
        JSON.stringify(DEFAULT_CHECKOUT_STATE)
    );

    preloadedStore.cart.items = preloadedCartItems.map(i =>
      i.quantity >= 1 ? i : { ...i, quantity: 1 }
    );

    preloadedStore.checkout = preloadedCheckoutData;
  } catch {
    localStoragClass.removeItem(CART);
    localStoragClass.removeItem(CHECKOUT);
  }

  const store = createStore(rootReducer, preloadedStore, composedEnhancers);
  return store;
}

export type RootStore = ReturnType<typeof rootReducer>;
