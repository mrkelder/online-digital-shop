import { Schema } from "mongoose";

import {
  CHARACTERISTIC_MODEL_NAME,
  SCHEMA_OPTIONS,
  SHOP_MODEL_NAME,
  SUB_CATEGORY_MODEL_NAME
} from "constants/db";

const characteristicDoc = {
  type: Schema.Types.ObjectId,
  ref: CHARACTERISTIC_MODEL_NAME
};

const characteristic = {
  c: characteristicDoc,
  values: [Number]
};

const itemSchema = new Schema(
  {
    available: {
      type: Boolean,
      default: false
    },
    available_in: [{ type: Schema.Types.ObjectId, ref: SHOP_MODEL_NAME }],
    description: {
      type: String,
      default: "Description"
    },
    key_characteristics: [characteristic],
    name: {
      type: String,
      default: "Item"
    },
    photo: { type: String, default: null },
    photos: [String],
    price: {
      type: Number,
      default: 999.99
    },
    rating: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0
    },
    subCategory: { type: Schema.Types.ObjectId, ref: SUB_CATEGORY_MODEL_NAME },
    characteristics: [characteristic]
  },
  SCHEMA_OPTIONS
);

itemSchema.index({ name: "text" });

export default itemSchema;
