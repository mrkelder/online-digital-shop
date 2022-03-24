import type Stripe from "stripe";

export interface CreatePaymentIntentResponse {
  secret: Stripe.PaymentIntent["client_secret"];
}
