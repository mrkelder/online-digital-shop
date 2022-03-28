import { Schema } from "mongoose";

import { SCHEMA_OPTIONS } from "constants/db";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      default: "Sub category"
    }
  },
  SCHEMA_OPTIONS
);

export default subCategorySchema;
