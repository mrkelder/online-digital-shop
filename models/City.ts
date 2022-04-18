import mongoose, { Schema } from "mongoose";

import { CITY_MODEL_NAME, SCHEMA_OPTIONS, SHOP_MODEL_NAME } from "constants/db";
import "models/Shop";

const citySchema = new Schema(
  {
    name: {
      ua: {
        type: String,
        default: "Місто"
      },
      ru: {
        type: String,
        default: "Город"
      }
    },
    shops: [{ type: Schema.Types.ObjectId, ref: SHOP_MODEL_NAME }]
  },
  SCHEMA_OPTIONS
);

export default mongoose.models[CITY_MODEL_NAME] ||
  mongoose.model(CITY_MODEL_NAME, citySchema);
