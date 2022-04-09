export interface CreatePaymentIntentResponse {
  secret: Stripe.PaymentIntent["client_secret"];
}

export interface GetItemsResponse {
  items: Pick<
    Product,
    "_id" | "photo" | "name" | "characteristics" | "rating" | "price"
  >;
  minPrice: number;
  maxPrice: number;
  characteristics: Characteristic[];
}

export type GetSliderResponse = Array<{ mobile: string; desktop: string }>;

export type GetRecommendationsResponse = Array<{
  item: Pick<Product, "name" | "photo" | "price" | "rating" | "_id">;
}>;

export type GetCategoriesResponse = Category[];
