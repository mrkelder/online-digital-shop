export interface CitySearchResult {
  index: number;
  name: City["name"];
}

export type ShopWithIndexObject = Shop & { index: number };

type ChangeShopEvent = CustomEvent<number>;
