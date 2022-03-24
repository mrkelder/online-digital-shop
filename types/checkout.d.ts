export type CheckoutFields =
  | "fullName"
  | "city"
  | "street"
  | "house"
  | "apartment"
  | "email";

export type CheckoutStages = 1 | 2 | 3;

export type CheckoutFormData = Record<CheckoutFields, string>;

export type CheckoutState = CheckoutFormData & {
  stripeClientId: string | undefined;
  currentStage: CheckoutStages;
};

export type CheckoutStateKeys = keyof CheckoutState;

export type CheckoutValidationData = OptionsFlags<CheckoutFormData>;
