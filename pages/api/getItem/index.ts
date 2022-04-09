import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import Characteristic from "models/Characteristic";
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

async function getPrice(
  sortingOrder: -1 | 1,
  subCategoryId: null | string
): Promise<number> {
  const item = await Item.find({
    ...(subCategoryId && { subCategory: subCategoryId })
  })
    .sort({ price: sortingOrder })
    .limit(1);

  if (item[0]) return item[0].price;
  else return sortingOrder === 1 ? MAX_PRICE : MIN_PRICE;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetItemsResponse | string>
) {
  try {
    await mongoose.connect(process.env.MONGODB_HOST as string);
    const { min, max, c, page, subCategoryId } = req.query;

    if (Array.isArray(subCategoryId))
      throw new Error("Sub category has to be a single value");

    const minMatchPrice = Math.max(min ? +min : MIN_PRICE, MIN_PRICE);
    const maxMatchPrice = Math.min(max ? +max : MAX_PRICE, MAX_PRICE);

    if (minMatchPrice > maxMatchPrice)
      throw new Error("A minimum price can't be more than a maximum price");

    const pageNumber = page ? +page : DEFAULT_PAGE;
    const queryCharacteristicsArray = Array.isArray(c) ? c : [c];

    const items = (await Item.aggregate([
      {
        $match: {
          ...(subCategoryId && {
            subCategory: new mongoose.Types.ObjectId(subCategoryId)
          }),
          ...(c && { $and: matchCharacteristics(queryCharacteristicsArray) }),
          price: { $gte: minMatchPrice, $lte: maxMatchPrice }
        }
      },
      {
        $skip: (pageNumber - 1) * ITEMS_PER_PAGE
      },
      { $limit: pageNumber * ITEMS_PER_PAGE },
      {
        $project: { name: 1, characteristics: 1, photo: 1, price: 1, rating: 1 }
      }
    ])) as GetItemsResponse["items"];

    const characteristics = await Characteristic.find({
      ...(subCategoryId && {
        subCategories: new mongoose.Types.ObjectId(subCategoryId)
      })
    });

    const minPrice = await getPrice(-1, subCategoryId);
    const maxPrice = await getPrice(1, subCategoryId);

    res.json({ items, minPrice, maxPrice, characteristics });
  } catch (err) {
    res.status(500).send("GetItem: something went wrong");
  } finally {
    await mongoose.disconnect();
  }
}
