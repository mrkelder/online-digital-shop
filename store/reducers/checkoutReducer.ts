import { Reducer } from "redux";

import LocalStorage from "utils/localStorage/localStorage";
import { CHECKOUT } from "utils/localStorage/localStorageNames";
import { CheckoutFormData } from "utils/validation/checkoutValidation";

export type CheckoutState = CheckoutFormData & {
  stripeClientId: string | undefined;
};

type ChangeFiledAction = {
  type: "checkout/changeField";
  payload: {
    name: keyof CheckoutState;
    value: string;
  };
};

type RestoreAction = { type: "checkout/restore" };

export type CheckoutActions = ChangeFiledAction | RestoreAction;

export const DEFAULT_CHECKOUT_STATE: CheckoutState = {
  fullName: "",
  city: "",
  street: "",
  house: "",
  apartment: "",
  email: "",
  stripeClientId: undefined
};

const localStoragClass = new LocalStorage();

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

  localStoragClass.setItem(CHECKOUT, newState);
  return newState;
};

export default checkoutReducer;
