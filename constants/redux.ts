import { FIRST_STAGE } from "constants/checkout-stages";
import type { CartState } from "types/cart-reducer";
import type { CheckoutState } from "types/checkout";

export const DEFAULT_CART_STATE: CartState = {
  items: []
};

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
