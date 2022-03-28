import { Schema } from "mongoose";

import { SCHEMA_OPTIONS } from "constants/db";

const citySchema = new Schema(
  {
    name: {
      type: String,
      default: "City"
    }
  },
  SCHEMA_OPTIONS
);

export default citySchema;
