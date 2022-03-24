import { Reducer } from "redux";

import Cookie from "utils/Cookie";
import { AMOUNT_OF_ITEMS_IN_CART } from "utils/Cookie/cookieNames";
import LocalStorage from "utils/LocalStorage";

import { CART } from "../../utils/LocalStorage/localStorageNames";

export type ReduxCartProduct = Pick<
  Product,
  "id" | "name" | "photo" | "price"
> & { quantity: number };

export interface CartState {
  items: ReadonlyArray<ReduxCartProduct>;
}

type RestoreAction = { type: "cart/restore" };

type AddItemAction = { type: "cart/addItem"; payload: ReduxCartProduct };

type RemoveItemAction = { type: "cart/removeItem"; payload: Product["id"] };

type ChangeQuantityAction = {
  type: "cart/changeQuantity";
  payload: { id: Product["id"]; quantity: number };
};

export type CartActions =
  | AddItemAction
  | RemoveItemAction
  | ChangeQuantityAction
  | RestoreAction;

export const DEFAULT_CART_STATE: CartState = {
  items: []
};

const cartReducer: Reducer<CartState, CartActions> = (
  state = DEFAULT_CART_STATE,
  action
) => {
  let newState = state;
  switch (action.type) {
    case "cart/addItem": {
      const foundIndex = state.items.findIndex(i => i.id === action.payload.id);
      if (foundIndex !== -1) newState.items[foundIndex].quantity += 1;
      else {
        newState = {
          items: [...state.items, action.payload]
        };
      }

      break;
    }

    case "cart/changeQuantity": {
      const foundIndex = state.items.findIndex(i => i.id === action.payload.id);
      const payloadNumber = action.payload.quantity;
      if (foundIndex !== -1) {
        newState.items[foundIndex].quantity =
          payloadNumber >= 1 ? payloadNumber : 1;
      }

      break;
    }

    case "cart/removeItem": {
      newState.items = state.items.filter(i => i.id !== action.payload);
      break;
    }

    case "cart/restore":
      newState.items = [];
      break;

    default:
      return newState;
  }

  Cookie.setCookie(AMOUNT_OF_ITEMS_IN_CART, newState.items.length.toString());
  LocalStorage.setItem(CART, newState.items);
  return JSON.parse(JSON.stringify(newState));
};

export default cartReducer;
