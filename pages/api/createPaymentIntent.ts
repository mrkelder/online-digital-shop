import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import stripe from "stripe";

import Item from "models/Item";
import { CreatePaymentIntentResponse } from "types/api";

interface FailureResolve {
  message: unknown;
}

type Data = CreatePaymentIntentResponse | FailureResolve;

const USDToGRNExchangeRate = 29.63;
const CentsToDollarsRation = 100;

const stripeObj = new stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2020-08-27"
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method?.toLocaleLowerCase() === "post") {
    try {
      await mongoose.connect(process.env.MONGODB_HOST as string);
      const items: ReadonlyArray<{ quantity: number; _id: string }> =
        JSON.parse(req.body);
      const mognodbSearchItems = [];

      for (const { quantity, _id } of items) {
        mognodbSearchItems.push(
          Item.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(_id) } },
            { $addFields: { quantity } },
            {
              $project: {
                name: 1,
                quantity: 1,
                price: 1,
                total: { $multiply: ["$price", "$quantity"] }
              }
            }
          ])
        );
      }

      const mongodbItems = (await Promise.all(mognodbSearchItems))
        .map(i => i[0])
        .filter(i => i);

      const totalPriceInGRN = mongodbItems
        .map(i => i.total)
        .reduce((a, b) => a + b, 0);
      const totalPriceInUSD = Math.ceil(totalPriceInGRN / USDToGRNExchangeRate);

      if (mongodbItems.length !== 0) {
        const { client_secret: clientSecret } =
          await stripeObj.paymentIntents.create({
            amount: +(totalPriceInUSD * CentsToDollarsRation).toFixed(2),
            currency: "USD",
            description: mongodbItems
              .map(i => `${i._id} (${i.quantity})`)
              .join(", ")
          });

        res.status(200).json({ secret: clientSecret });
      } else {
        res.status(400).json({
          message: "CreatePaymentIntent: unacceptable data has been passed"
        });
      }
    } catch (err) {
      res.status(500).json({
        message: "CreatePaymentIntent: server couldn't handle this request"
      });
    } finally {
      await mongoose.disconnect();
    }
  } else {
    res
      .status(405)
      .json({ message: "CreatePaymentIntent: only POST method is allowed" });
  }
}
