import type { NextApiRequest, NextApiResponse } from "next";
import stripe from "stripe";

import { CreatePaymentIntentResponse } from "types/api";
import Firebase from "utils/firebase";

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
      const firebase = new Firebase();
      const items: ReadonlyArray<{ quantity: number; id: string }> = JSON.parse(
        req.body
      );

      const arrayOfIds = items.map(i => i.id);

      const data = await firebase.getDocumentsByIds<FirebaseProduct>(
        "products",
        arrayOfIds
      );

      const firebaseProductsIds = data.map(i => i.id);

      const descriptionReadyItems = items.filter(i =>
        firebaseProductsIds.includes(i.id)
      );

      const totalPriceInGRN = data.map(i => i.price).reduce((a, b) => a + b, 0);
      const totalPriceInUSD = Math.ceil(totalPriceInGRN / USDToGRNExchangeRate);

      if (data.length !== 0) {
        const { client_secret: clientSecret } =
          await stripeObj.paymentIntents.create({
            amount: totalPriceInUSD * CentsToDollarsRation,
            currency: "USD",
            description: descriptionReadyItems
              .map(i => `${i.id} (${i.quantity})`)
              .join(", ")
          });

        res.status(200).json({ secret: clientSecret });
      } else {
        res.status(400).json({
          message: "CreatePaymentIntent: unacceptable data has been passed"
        });
      }
    } catch {
      res.status(500).json({
        message: "CreatePaymentIntent: server couldn't handle this request"
      });
    }
  } else {
    res
      .status(405)
      .json({ message: "CreatePaymentIntent: only POST method is allowed" });
  }
}
