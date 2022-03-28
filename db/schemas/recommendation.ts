import { Schema } from "mongoose";

import { ITEM_MODEL_NAME, SCHEMA_OPTIONS } from "constants/db";

const recommendationSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: ITEM_MODEL_NAME }
  },
  SCHEMA_OPTIONS
);

export default recommendationSchema;
