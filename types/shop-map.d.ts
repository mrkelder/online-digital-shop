export interface CitySearchResult {
  index: number;
  name: City["name"];
}

export type ShopWithIndexObject = Shop & { index: number };

export type ChangeShopEvent = CustomEvent<number>;

export interface MapProps {
  cities: City[];
}
