import mongoose from "mongoose";

import {
  CATEGORY_MODEL_NAME,
  CHARACTERISTIC_MODEL_NAME,
  CITY_MODEL_NAME,
  ITEM_MODEL_NAME,
  RECOMMENDATION_MODEL_NAME,
  SHOP_MODEL_NAME,
  SLIDE_MODEL_NAME,
  SUB_CATEGORY_MODEL_NAME
} from "constants/db";

import categorySchema from "./schemas/category";
import characteristicSchema from "./schemas/characteristic";
import citySchema from "./schemas/city";
import itemSchema from "./schemas/item";
import recommendationSchema from "./schemas/recommendation";
import shopSchema from "./schemas/shop";
import slideSchema from "./schemas/slide";
import subCategorySchema from "./schemas/subCategory";

const Category = mongoose.model(CATEGORY_MODEL_NAME, categorySchema);
const Characteristic = mongoose.model(
  CHARACTERISTIC_MODEL_NAME,
  characteristicSchema
);
const City = mongoose.model(CITY_MODEL_NAME, citySchema);
const Item = mongoose.model(ITEM_MODEL_NAME, itemSchema);
const Recommendation = mongoose.model(
  RECOMMENDATION_MODEL_NAME,
  recommendationSchema
);
const Shop = mongoose.model(SHOP_MODEL_NAME, shopSchema);
const Slide = mongoose.model(SLIDE_MODEL_NAME, slideSchema);
const SubCategory = mongoose.model(SUB_CATEGORY_MODEL_NAME, subCategorySchema);

export {
  Category,
  Characteristic,
  City,
  Item,
  Recommendation,
  Shop,
  Slide,
  SubCategory
};
