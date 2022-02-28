import { combineReducers, createStore, Store, EmptyObject } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { CartState, CartActions } from "./cartReducer";
import cartReducer from "./cartReducer";
import { CART } from "./localStorageNames";

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
  const preloadedStore: StoreState = { cart: { items: [] } };

  try {
    const preloadedCartItems: CartState["items"] = JSON.parse(
      localStorage.getItem(CART) ?? "[]"
    );

    preloadedStore.cart.items = preloadedCartItems.map(i =>
      i.quantity >= 1 ? i : { ...i, quantity: 1 }
    );
  } catch {
    localStorage.removeItem(CART);
  }

  const store = createStore(rootReducer, preloadedStore, composedEnhancers);
  return store;
}

export type RootStore = ReturnType<typeof rootReducer>;
