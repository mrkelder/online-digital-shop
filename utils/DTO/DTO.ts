import { ReduxCartProduct } from "store/reducers/cartReducer";

class DTO {
  public productToReduxCartProduct(product: Product): ReduxCartProduct {
    const { id, name, price, photo } = product;
    return { id, name, price, photo, quantity: 1 };
  }

  public categoriesToSubCategoryIds(categories: Category[]) {
    const subcategoryIds: SubCategory["id"][] = [];
    categories.forEach(i =>
      i.subcategories.forEach(s => subcategoryIds.push(s))
    );
    return subcategoryIds;
  }

  public firebaseShopToShop(shop: FirebaseShop): Shop {
    const { _lat, _long } = shop.geo;
    return { ...shop, geo: { lat: _lat, lng: _long } };
  }
}

export default DTO;
