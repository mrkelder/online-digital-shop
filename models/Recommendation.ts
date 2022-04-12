import mongoose, { Schema } from "mongoose";

import {
  ITEM_MODEL_NAME,
  RECOMMENDATION_MODEL_NAME,
  SCHEMA_OPTIONS
} from "constants/db";

const recommendationSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: ITEM_MODEL_NAME }
  },
  SCHEMA_OPTIONS
);

export default mongoose.models[RECOMMENDATION_MODEL_NAME] ||
  mongoose.model(RECOMMENDATION_MODEL_NAME, recommendationSchema);
