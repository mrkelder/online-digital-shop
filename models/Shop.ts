import mongoose, { Schema } from "mongoose";

import { SCHEMA_OPTIONS, SHOP_MODEL_NAME } from "constants/db";

const shopSchema = new Schema(
  {
    name: {
      type: String,
      default: "New London Shop"
    },
    geo: [Number, Number],
    schedule: [
      {
        type: Object,
        value: Schema.Types.Mixed
      }
    ]
  },
  SCHEMA_OPTIONS
);

export default mongoose.models[SHOP_MODEL_NAME] ||
  mongoose.model(SHOP_MODEL_NAME, shopSchema);
