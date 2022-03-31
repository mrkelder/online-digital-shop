import { Schema } from "mongoose";

import { SCHEMA_OPTIONS } from "constants/db";

const slideSchema = new Schema(
  {
    mobile: String,
    desktop: String
  },
  SCHEMA_OPTIONS
);

export default slideSchema;
