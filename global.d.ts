interface MultiLanguageField {
  ua: string;
  ru: string;
}

interface Category {
  _id?: string;
  name: MultiLanguageField;
  subCategories: SubCategory[];
  icon: string;
  __v?: number;
}

interface Characteristic {
  _id?: string;
  name: MultiLanguageField;
  values: string[];
  subCategories: SubCategory[];
  __v?: number;
}

interface City {
  _id?: string;
  name: MultiLanguageField;
  shops: Shop[];
  __v?: number;
}

interface Item {
  _id?: string;
  name: string;
  available_in: Shop[];
  available: boolean;
  characteristics: Array<{
    c: Characteristic;
    values: number[];
  }>;
  key_characteristics: number[];
  price: number;
  subCategory: string;
  photo: string | null;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  photos: string[];
  description: string;
  __v?: number;
}

interface Shop {
  _id?: string;
  name: MultiLanguageField;
  city: City;
  geo: [number, number];
  schedule: ReadonlyArray<{ from: string; to: string } | null>;
  __v?: number;
}

interface SubCategory {
  _id?: string;
  name: MultiLanguageField;
  __v: number;
}

type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};

interface QueryObject {
  field: string | FieldPath;
  condition: WhereFilterOp;
  value: any[] | any;
}
