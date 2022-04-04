import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import { populateCreator } from "constants/db";
import City from "models/City";

import "models/Shop";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await mongoose.connect(process.env.MONGODB_HOST as string);
  const data = await City.find().populate(populateCreator("shops"));
  res.json(data);
  await mongoose.disconnect();
}
