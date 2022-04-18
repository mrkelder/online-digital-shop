import mongoose, { Schema } from "mongoose";

import { SCHEMA_OPTIONS, SUB_CATEGORY_MODEL_NAME } from "constants/db";

const subCategorySchema = new Schema(
  {
    name: {
      ua: {
        type: String,
        default: "Під категорія"
      },
      ru: {
        type: String,
        default: "Под категория"
      }
    }
  },
  SCHEMA_OPTIONS
);

export default mongoose.models[SUB_CATEGORY_MODEL_NAME] ||
  mongoose.model(SUB_CATEGORY_MODEL_NAME, subCategorySchema);
