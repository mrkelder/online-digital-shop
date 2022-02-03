interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: SubCategory["id"][];
}

interface CatalogInfo {
  categories: Category[] | null;
  subcategories: SubCategory[] | null;
}

interface Slide {
  id: string;
  name: string;
}

interface ProductCharacteristic {
  name: Characteristic["name"];
  value: string;
  id: Characteristic["id"];
}

interface Photo {
  image1x: string;
  image2x: string;
}

interface Product {
  id: string;
  name: string;
  available_in: Shop[];
  available: boolean;
  characteristics: ProductCharacteristic[];
  key_characteristics: ProductCharacteristic[];
  price: number;
  subcategory: string;
  photo: Photo | null;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  photos: Photo[];
  description: string;
}

type FirebaseProduct = Omit<
  Omit<Product, "characteristics">,
  "key_characteristics"
> & {
  characteristics: Array<{ name: Characteristic["id"]; value: number[] }>;
  key_characteristics: Array<Characteristic["id"]>;
  available_in: Array<Shop["id"]>;
};

interface Reccommendation {
  id: string;
  item_id: Product["id"];
}

interface City {
  id: string;
  name: string;
}

interface Shop {
  id: string;
  city: City["id"];
  geo: { lat: number; lng: number };
  name: string;
  schedule: ReadonlyArray<{ from: string; to: string } | null>;
}

type FirebaseShop = Omit<Shop, "geo"> & {
  geo: { _lat: number; _long: number };
};

interface GeoInfo {
  shops: Shop[];
  cities: City[];
}

interface Characteristic {
  id: string;
  name: string;
  subcategory: SubCategory["id"];
  values: string[];
}

type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};

interface QueryObject {
  field: string | FieldPath;
  condition: WhereFilterOp;
  value: any[] | any;
}
