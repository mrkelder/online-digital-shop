import { CartState } from "types/cart-reducer";
import { CheckoutStages, CheckoutState } from "types/checkout";

export const DEFAULT_CART_STATE: CartState = {
  items: []
};

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
