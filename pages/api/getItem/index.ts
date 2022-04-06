import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import Item from "models/Item";
import { GetItemsResponse } from "types/api";

import "models/Characteristic";

const MIN_PRICE = 0;
const MAX_PRICE = Number.MAX_SAFE_INTEGER;
const DEFAULT_PAGE = 1;
const ITEMS_PER_PAGE = 10;

function matchCharacteristics(queryCharacteristicsArray: string[]) {
  return queryCharacteristicsArray.map(i => ({
    characteristics: {
      $elemMatch: {
        c: new mongoose.Types.ObjectId(i.split(".")[0]),
        values: +i.split(".")[1]
      }
    }
  }));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetItemsResponse | string>
) {
  try {
    await mongoose.connect(process.env.MONGODB_HOST as string);
    const { min, max, c, page, subCategoryId } = req.query;

    const minPrice = Math.max(min ? +min : MIN_PRICE, MIN_PRICE);
    const maxPrice = Math.min(max ? +max : MAX_PRICE, MAX_PRICE);

    if (minPrice > maxPrice)
      throw new Error("A minimum price can't be more than a maximum price");

    const pageNumber = page ? +page : DEFAULT_PAGE;
    const queryCharacteristicsArray = Array.isArray(c) ? c : [c];

    const data = await Item.aggregate([
      {
        $match: {
          ...(subCategoryId && {
            subCategory: new mongoose.Types.ObjectId(subCategoryId as string)
          }),
          ...(c && { $and: matchCharacteristics(queryCharacteristicsArray) }),
          price: { $gte: minPrice, $lte: maxPrice }
        }
      },
      {
        $skip: (pageNumber - 1) * ITEMS_PER_PAGE
      },
      { $limit: pageNumber * ITEMS_PER_PAGE },
      { $project: { name: 1, characteristics: 1, photo: 1, price: 1 } }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).send("GetItem: something went wrong");
  } finally {
    await mongoose.disconnect();
  }
}
