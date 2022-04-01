import { ReduxCartProduct } from "types/cart-reducer";

class DTO {
  public static productToReduxCartProduct(product: Product): ReduxCartProduct {
    const { id, name, price, photo } = product;
    return { id, name, price, photo, quantity: 1 };
  }

  public static categoriesToSubCategoryIds(categories: Category[]) {
    const subcategoryIds: SubCategory["id"][] = [];
    categories.forEach(i =>
      i.subcategories.forEach(s => subcategoryIds.push(s))
    );
    return subcategoryIds;
  }

  public static firebaseShopToShop(shop: FirebaseShop): Shop {
    const { _lat, _long } = shop.geo;
    return { ...shop, geo: { lat: _lat, lng: _long } };
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
