import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import Slide from "models/Slide";
import { GetSliderResponse } from "types/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetSliderResponse>
) {
  await mongoose.connect(process.env.MONGODB_HOST as string);
  const data = await Slide.find({}, { mobile: 1, desktop: 1, _id: 0 });
  res.json(data);
  await mongoose.disconnect();
}
