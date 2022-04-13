import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import Item from "models/Item";
import { SearchItemsResponse } from "types/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchItemsResponse | string>
) {
  try {
    const { text } = req.query;

    if (!text) {
      res.status(400).send("ItemSearch: no text has been provided");
      return;
    }

    await mongoose.connect(process.env.MONGODB_HOST as string);

    const items = await Item.find(
      { name: { $regex: text, $options: "ig" } },
      { name: 1, price: 1, photo: 1 }
    );

    res.json(items);
  } catch {
    res.status(500).send("ItemSearch: server coulnd't work the request out");
  } finally {
    if (mongoose.connection.readyState === 1) await mongoose.disconnect();
  }
}
