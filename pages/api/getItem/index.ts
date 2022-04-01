import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import { populateCreator } from "constants/db";
import Item from "models/Item";

import "models/Characteristic";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO: query by price, characteristics etc.
  await mongoose.connect(process.env.MONGODB_HOST as string);
  const data = await Item.find().populate(populateCreator("characteristics.c"));
  res.json(data);
  await mongoose.disconnect();
}
