import mongoose, { Schema } from "mongoose";

import { SCHEMA_OPTIONS, SLIDE_MODEL_NAME } from "constants/db";

const slideSchema = new Schema(
  {
    mobile: String,
    desktop: String
  },
  SCHEMA_OPTIONS
);

export default mongoose.models[SLIDE_MODEL_NAME] ||
  mongoose.model(SLIDE_MODEL_NAME, slideSchema);
