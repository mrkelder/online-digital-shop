export interface CreatePaymentIntentResponse {
  secret: Stripe.PaymentIntent["client_secret"];
}

export type GetSliderResponse = Array<{ mobile: string; desktop: string }>;

export type GetRecommendationsResponse = Array<{
  item: Pick<Product, "name" | "photo" | "price" | "rating" | "_id">;
}>;

export type GetCategoriesResponse = Category[];

export type GetItemsResponse = Product[];
