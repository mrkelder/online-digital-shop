import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import Category from "models/Category";

import "models/SubCategory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Category | string>
) {
  await mongoose.connect(process.env.MONGODB_HOST as string);
  try {
    const { id } = req.query;

    const data = await Category.findById(id, { __v: 0 }).populate(
      "subCategories"
    );

    if (!data) {
      res.status(404).send("GetCategory/[id]: not found");
      return;
    }

    res.json(data);
  } catch {
    res
      .status(500)
      .send("GetCategory/[id]: server couldn't work your request out");
  } finally {
    await mongoose.disconnect();
  }
}
