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

interface Product {
  id: string;
  name: string;
  available_in: string[];
  available: boolean;
  characteristics: Array<{ [name: string]: string }>;
  key_characteristics: string[];
  price: number;
  subcategory: string;
  photo: {
    image1x: string;
    image2x: string;
  } | null;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
}

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
