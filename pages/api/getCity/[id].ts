import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import { populateCreator } from "constants/db";
import City from "models/City";

import "models/Shop";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Item | string>
) {
  await mongoose.connect(process.env.MONGODB_HOST as string);
  try {
    const { id } = req.query;

    const data = await City.findById(id, { __v: 0 }).populate(
      populateCreator("shops")
    );

    if (!data) {
      res.status(404).send("GetCity/[id]: not found");
      return;
    }

    res.json(data);
  } catch {
    res.status(500).send("GetCity/[id]: server couldn't work your request out");
  } finally {
    await mongoose.disconnect();
  }
}
