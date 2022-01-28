import { ReduxCartProduct } from "store/cartReducer";

export default function convertToReduxCartProduct(
  product: Product
): ReduxCartProduct {
  const { id, name, price, photo } = product;
  return { id, name, price, photo, quantity: 1 };
}
