import { ReduxCartProduct } from "types/cart-reducer";

class DTO {
  public static productToReduxCartProduct(product: Product): ReduxCartProduct {
    const { _id, name, price, photo } = product;
    return { _id, name, price, photo, quantity: 1 };
  }

  public static mongodbCharacteristicValueToString(
    values: string[],
    indexes: number[]
  ): string {
    let totalStringArray: string[] = [];
    indexes.forEach(i => totalStringArray.push(values[i]));
    return totalStringArray.join(", ");
  }
}

export default DTO;
