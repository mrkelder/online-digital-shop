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
  photo: string | StaticImageData;
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
  schedule: string[];
}

interface GeoInfo {
  shops: Shop[];
  cities: City[];
}
