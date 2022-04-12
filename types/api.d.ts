export interface CreatePaymentIntentResponse {
  secret: Stripe.PaymentIntent["client_secret"];
}

export interface GetItemsResponse {
  items: Pick<
    Item,
    "_id" | "photo" | "name" | "characteristics" | "rating" | "price"
  >[];
  minPrice: number;
  maxPrice: number;
  characteristics: Characteristic[];
  totalQuantityOfItems: number;
}

export type GetSliderResponse = Array<{ mobile: string; desktop: string }>;

export type GetRecommendationsResponse = Array<{
  item: Pick<Item, "name" | "photo" | "price" | "rating" | "_id">;
}>;

export type GetCategoriesResponse = Category[];

export type GetCitiesResponse = City[];
