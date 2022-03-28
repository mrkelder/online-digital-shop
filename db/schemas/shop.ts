import { Schema } from "mongoose";

import { SCHEMA_OPTIONS, CITY_MODEL_NAME } from "constants/db";

const shopSchema = new Schema(
  {
    name: {
      type: String,
      default: "New London Shop"
    },
    city: { type: Schema.Types.ObjectId, ref: CITY_MODEL_NAME },
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

export default shopSchema;
