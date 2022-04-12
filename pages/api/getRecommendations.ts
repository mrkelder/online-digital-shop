import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import Recommendation from "models/Recommendation";
import { GetRecommendationsResponse } from "types/api";

import "models/Item";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetRecommendationsResponse | string>
) {
  try {
    await mongoose.connect(process.env.MONGODB_HOST as string);
    const data: GetRecommendationsResponse = await Recommendation.find(
      {},
      { item: 1, _id: 0 }
    ).populate({
      path: "item",
      select: "name price photo rating id"
    });
    res.json(data);
  } catch {
    res.status(500).send("GetRecommendations: couldn't server the request");
  } finally {
    await mongoose.disconnect();
  }
}
