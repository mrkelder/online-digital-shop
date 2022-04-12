import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import { populateCreator } from "constants/db";
import City from "models/City";
import { GetCitiesResponse } from "types/api";

import "models/Shop";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetCitiesResponse | string>
) {
  try {
    await mongoose.connect(process.env.MONGODB_HOST as string);
    const data = (await City.find().populate(
      populateCreator("shops")
    )) as City[];
    res.json(data);
  } catch {
    res.status(500).send("GetCity: couldn't server the request");
  } finally {
    await mongoose.disconnect();
  }
}
