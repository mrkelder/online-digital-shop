interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
  category: string;
}

interface Slide {
  id: string;
  name: string;
}

interface Reccommendation {
  id: string;
  item_id: string;
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

interface City {
  id: string;
  name: string;
}

interface Shop {
  id: string;
  city: City["id"];
  geo: [number, number];
  name: string;
  schedule: string[];
}
