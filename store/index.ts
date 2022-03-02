import { combineReducers, createStore, Store, EmptyObject } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import LocalStorage from "utils/localStorage/localStorage";

import { CART } from "../utils/localStorage/localStorageNames";
import { CartState, CartActions } from "./cartReducer";
import cartReducer from "./cartReducer";

export type ReduxStore = Store<
  EmptyObject & {
    cart: CartState;
  },
  CartActions
>;

interface StoreState {
  cart: CartState;
}

const rootReducer = combineReducers({ cart: cartReducer });

const composedEnhancers = composeWithDevTools();

export const epmtyStore: ReduxStore = createStore(rootReducer);

export function storeInitiator(): ReduxStore {
  const localStoragClass = new LocalStorage();
  const preloadedStore: StoreState = { cart: { items: [] } };

  try {
    const preloadedCartItems: CartState["items"] = JSON.parse(
      localStoragClass.getItem(CART) ?? "[]"
    );

    preloadedStore.cart.items = preloadedCartItems.map(i =>
      i.quantity >= 1 ? i : { ...i, quantity: 1 }
    );
  } catch {
    localStoragClass.removeItem(CART);
  }

  const store = createStore(rootReducer, preloadedStore, composedEnhancers);
  return store;
}

export type RootStore = ReturnType<typeof rootReducer>;
