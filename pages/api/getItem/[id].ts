import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import { populateCreator } from "constants/db";
import Item from "models/Item";

import "models/Characteristic";
import "models/Shop";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Item | string>
) {
  await mongoose.connect(process.env.MONGODB_HOST as string);
  try {
    const { id } = req.query;
    const data = await Item.findById(id, { __v: 0 })
      .populate(populateCreator("characteristics.c"))
      .populate(populateCreator("available_in"));

    if (!data) {
      res.status(404).send("GetItem/[id]: not found");
      return;
    }

    res.json(data);
  } catch {
    res.status(500).send("GetItem/[id]: server couldn't work your request out");
  } finally {
    await mongoose.disconnect();
  }
}
