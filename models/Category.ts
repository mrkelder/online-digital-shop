import mongoose, { Schema } from "mongoose";

import {
  CATEGORY_MODEL_NAME,
  SCHEMA_OPTIONS,
  SUB_CATEGORY_MODEL_NAME
} from "constants/db";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      default: "Category"
    },
    subCategories: [
      { type: Schema.Types.ObjectId, ref: SUB_CATEGORY_MODEL_NAME }
    ],
    icon: {
      type: String,
      required: true
    }
  },
  SCHEMA_OPTIONS
);

export default mongoose.models[CATEGORY_MODEL_NAME] ||
  mongoose.model(CATEGORY_MODEL_NAME, categorySchema);
