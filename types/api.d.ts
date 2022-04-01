export interface CreatePaymentIntentResponse {
  secret: Stripe.PaymentIntent["client_secret"];
}

export type GetSliderResponse = Array<{ mobile: string; desktop: string }>;
