import mongoose, { Schema } from "mongoose";

import {
  CHARACTERISTIC_MODEL_NAME,
  SCHEMA_OPTIONS,
  SUB_CATEGORY_MODEL_NAME
} from "constants/db";

const characteristicSchema = new Schema(
  {
    name: {
      type: String,
      default: "Characteristic"
    },
    subCategories: {
      type: Schema.Types.ObjectId,
      ref: SUB_CATEGORY_MODEL_NAME
    },
    values: [String]
  },
  SCHEMA_OPTIONS
);

export default mongoose.models[CHARACTERISTIC_MODEL_NAME] ||
  mongoose.model(CHARACTERISTIC_MODEL_NAME, characteristicSchema);
