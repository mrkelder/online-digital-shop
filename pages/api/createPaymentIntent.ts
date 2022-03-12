import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import stripe from "stripe";

export interface CreatePaymentIntentResponse {
  secret: Stripe.PaymentIntent["client_secret"];
}

interface FailureResolve {
  message: unknown;
}

type Data = CreatePaymentIntentResponse | FailureResolve;

const stripeObj = new stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2020-08-27"
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method?.toLocaleLowerCase() === "post") {
    try {
      const { client_secret: clientSecret } =
        await stripeObj.paymentIntents.create({
          amount: 2000,
          currency: "USD"
        });

      res.status(200).json({ secret: clientSecret });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  } else {
    res
      .status(405)
      .json({ message: "CreatePaymentIntent: only POST method is allowed" });
  }
}
