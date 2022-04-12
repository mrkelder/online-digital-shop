export type ReduxCartProduct = Pick<
  Item,
  "_id" | "name" | "photo" | "price"
> & { quantity: number };

export interface CartState {
  items: ReadonlyArray<ReduxCartProduct>;
}

type RestoreAction = { type: "cart/restore" };

type AddItemAction = { type: "cart/addItem"; payload: ReduxCartProduct };

type RemoveItemAction = { type: "cart/removeItem"; payload: Item["id"] };

type ChangeQuantityAction = {
  type: "cart/changeQuantity";
  payload: { id: Item["id"]; quantity: number };
};

export type CartActions =
  | AddItemAction
  | RemoveItemAction
  | ChangeQuantityAction
  | RestoreAction;
