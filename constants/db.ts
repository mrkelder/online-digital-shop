import type { SchemaOptions } from "mongoose";

const isDevelopment = process.env.NODE_ENV !== "production";

export const SCHEMA_OPTIONS: SchemaOptions = {
  autoCreate: isDevelopment,
  autoIndex: isDevelopment
};

export const ITEM_MODEL_NAME = "Item";

export const CATEGORY_MODEL_NAME = "Category";

export const CHARACTERISTIC_MODEL_NAME = "Characteristic";

export const CITY_MODEL_NAME = "City";

export const RECOMMENDATION_MODEL_NAME = "Recommendation";

export const SHOP_MODEL_NAME = "Shop";

export const SLIDE_MODEL_NAME = "Slide";

export const SUB_CATEGORY_MODEL_NAME = "SubCategory";
