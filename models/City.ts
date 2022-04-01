import mongoose, { Schema } from "mongoose";

import { CITY_MODEL_NAME, SCHEMA_OPTIONS } from "constants/db";

const citySchema = new Schema(
  {
    name: {
      type: String,
      default: "City"
    }
  },
  SCHEMA_OPTIONS
);

export default mongoose.models[CITY_MODEL_NAME] ||
  mongoose.model(CITY_MODEL_NAME, citySchema);
