import { Schema } from "mongoose";

import { SCHEMA_OPTIONS } from "constants/db";

const slideSchema = new Schema(
  {
    photo: String
  },
  SCHEMA_OPTIONS
);

export default slideSchema;
