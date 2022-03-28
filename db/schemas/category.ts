import { Schema } from "mongoose";

import { SCHEMA_OPTIONS, SUB_CATEGORY_MODEL_NAME } from "constants/db";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      default: "Category"
    },
    subCategories: [
      { type: Schema.Types.ObjectId, ref: SUB_CATEGORY_MODEL_NAME }
    ]
  },
  SCHEMA_OPTIONS
);

export default categorySchema;
