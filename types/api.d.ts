export interface CreatePaymentIntentResponse {
  secret: Stripe.PaymentIntent["client_secret"];
}
