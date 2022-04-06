import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import Category from "models/Category";
import { GetCategoriesResponse } from "types/api";

import "models/SubCategory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetCategoriesResponse>
) {
  await mongoose.connect(process.env.MONGODB_HOST as string);
  const categories = (await Category.find({}, { __v: 0 }).populate(
    "subCategories"
  )) as Category[];
  res.json(categories);
  await mongoose.disconnect();
}
