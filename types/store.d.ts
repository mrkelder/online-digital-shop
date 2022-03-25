export type ReduxStore = Store<
  EmptyObject & {
    cart: CartState;
    checkout: CheckoutState;
  },
  CartActions | CheckoutActions
>;

export interface StoreState {
  cart: CartState;
  checkout: CheckoutState;
}

export type RootStore = Reducer<
  CombinedState<{
    cart: CartState;
    checkout: CheckoutState;
  }>,
  CartActions | CheckoutActions
>;
