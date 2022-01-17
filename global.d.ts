interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
  category: Category["id"];
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
}

type FirebaseProduct = Omit<
  Omit<Product, "characteristics">,
  "key_characteristics"
> & {
  characteristics: Array<{ name: Characteristic["id"]; value: string }>;
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
  subCategory: SubCategory["id"];
}
