import { Schema } from "mongoose";

import { SCHEMA_OPTIONS, SUB_CATEGORY_MODEL_NAME } from "constants/db";

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

export default characteristicSchema;
