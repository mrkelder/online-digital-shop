import { Reducer } from "redux";

import { CheckoutStages, CheckoutState } from "types/checkout";
import { CheckoutActions } from "types/checkout-reducer";
import LocalStorage from "utils/LocalStorage";
import { CHECKOUT } from "utils/LocalStorage/localStorageNames";

// FIXME: it definetely needs some more organization rather than all types and data in one file
// wich is by the way intended to be for the reducer only

export const FIRST_STAGE: CheckoutStages = 1;
export const SECOND_STAGE: CheckoutStages = 2;
export const THIRD_STAGE: CheckoutStages = 3;

export const DEFAULT_CHECKOUT_STATE: CheckoutState = {
  fullName: "",
  city: "",
  street: "",
  house: "",
  apartment: "",
  email: "",
  stripeClientId: undefined,
  currentStage: FIRST_STAGE
};

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
