import { Reducer } from "redux";
import { CART } from "./localStorageNames";

export interface CartState {
  items: ReadonlyArray<{ id: Product["id"]; quantity: number }>;
}

type AddItemAction = { type: "cart/addItem"; payload: Product["id"] };

type RemoveItemAction = { type: "cart/removeItem"; payload: Product["id"] };

type ChangeQuantityAction = {
  type: "cart/changeQuantity";
  payload: { id: Product["id"]; quantity: number };
};

export type CartActions =
  | AddItemAction
  | RemoveItemAction
  | ChangeQuantityAction;

const DEFAULT_STATE: CartState = {
  items: []
};

const cartReducer: Reducer<CartState, CartActions> = (
  state = DEFAULT_STATE,
  action
) => {
  let newState = state;
  switch (action.type) {
    case "cart/addItem": {
      const foundIndex = state.items.findIndex(i => i.id === action.payload);
      if (foundIndex !== -1) newState.items[foundIndex].quantity += 1;
      else {
        newState = {
          items: [...state.items, { id: action.payload, quantity: 1 }]
        };
      }

      break;
    }

    case "cart/changeQuantity": {
      const foundIndex = state.items.findIndex(i => i.id === action.payload.id);
      const payloadNumber = action.payload.quantity;
      if (foundIndex !== -1) {
        newState.items[foundIndex].quantity =
          payloadNumber >= 0 ? payloadNumber : 0;
      }
    }

    case "cart/removeItem": {
      newState.items = state.items.filter(i => i.id !== action.payload);
    }

    default:
      return newState;
  }

  localStorage.setItem(CART, JSON.stringify(newState.items));
  return newState;
};

export default cartReducer;
