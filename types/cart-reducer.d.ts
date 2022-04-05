export type ReduxCartProduct = Pick<
  Product,
  "_id" | "name" | "photo" | "price"
> & { quantity: number };

export interface CartState {
  items: ReadonlyArray<ReduxCartProduct>;
}

type RestoreAction = { type: "cart/restore" };

type AddItemAction = { type: "cart/addItem"; payload: ReduxCartProduct };

type RemoveItemAction = { type: "cart/removeItem"; payload: Product["id"] };

type ChangeQuantityAction = {
  type: "cart/changeQuantity";
  payload: { id: Product["id"]; quantity: number };
};

export type CartActions =
  | AddItemAction
  | RemoveItemAction
  | ChangeQuantityAction
  | RestoreAction;
