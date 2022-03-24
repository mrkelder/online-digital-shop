import { Reducer } from "redux";

import { CHECKOUT } from "constants/localstorage-names";
import { DEFAULT_CHECKOUT_STATE } from "constants/redux";
import { CheckoutState } from "types/checkout";
import { CheckoutActions } from "types/checkout-reducer";
import LocalStorage from "utils/LocalStorage";

const checkoutReducer: Reducer<CheckoutState, CheckoutActions> = (
  state = DEFAULT_CHECKOUT_STATE,
  action
) => {
  let newState = state;
  switch (action.type) {
    case "checkout/changeField": {
      const { name, value } = action.payload;
      newState = { ...newState, [name]: value };
      break;
    }

    case "checkout/restore": {
      newState = DEFAULT_CHECKOUT_STATE;
      break;
    }

    default:
      return state;
  }

  LocalStorage.setItem(CHECKOUT, newState);
  return newState;
};

export default checkoutReducer;
