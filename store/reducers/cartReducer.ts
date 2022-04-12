import { Reducer } from "redux";

import { AMOUNT_OF_ITEMS_IN_CART } from "constants/cookie-names";
import { CART } from "constants/localstorage-names";
import { DEFAULT_CART_STATE } from "constants/redux";
import { CartState, CartActions } from "types/cart-reducer";
import Cookie from "utils/Cookie";
import LocalStorage from "utils/LocalStorage";

const cartReducer: Reducer<CartState, CartActions> = (
  state = DEFAULT_CART_STATE,
  action
) => {
  let newState = state;
  switch (action.type) {
    case "cart/addItem": {
      const foundIndex = state.items.findIndex(
        i => i._id === action.payload._id
      );
      if (foundIndex !== -1) newState.items[foundIndex].quantity += 1;
      else {
        newState = {
          items: [...state.items, action.payload]
        };
      }

      break;
    }

    case "cart/changeQuantity": {
      const foundIndex = state.items.findIndex(
        i => i._id === action.payload.id
      );
      const payloadNumber = action.payload.quantity;
      if (foundIndex !== -1) {
        newState.items[foundIndex].quantity =
          payloadNumber >= 1 ? payloadNumber : 1;
      }

      break;
    }

    case "cart/removeItem": {
      newState.items = state.items.filter(i => i._id !== action.payload);
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
