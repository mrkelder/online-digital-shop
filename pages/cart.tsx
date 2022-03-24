import { useCallback, useMemo } from "react";

import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import Button from "components/Button";
import CartItem from "components/cart-page/CartItem";
import MetaHead from "components/meta/MetaHead";
import { RootStore } from "store";
import { CartState } from "types/cart-reducer";

const CartPage: NextPage = () => {
  const router = useRouter();
  const storeItems = useSelector<RootStore>(
    store => store.cart.items
  ) as CartState["items"];

  const priceBlockStyle = storeItems.length === 0 ? "hidden" : "block";

  const totalPrice = useMemo(
    () => storeItems.map(i => i.quantity * i.price).reduce((a, c) => a + c, 0),
    [storeItems]
  );

  const linkToCheckout = useCallback(() => {
    if (storeItems.length > 0) router.push("/checkout");
  }, [storeItems, router]);

  return (
    <div>
      <MetaHead title="Корзина" noindex />

      <Link href="/catalog">
        <a className="underline lg:text-base">Продолжить покупки</a>
      </Link>
      <div className="flex flex-col items-center">
        <h1>Корзина</h1>
        <p className="text-grey-300 text-base">
          {storeItems.length} товаров на сумму{" "}
          <span className="text-grey-650 font-bold text-base">
            {totalPrice} грн
          </span>
        </p>
        {storeItems.length === 0 && (
          <p className="mt-3 text-base lg:mt-16 lg:text-lg lg:font-bold">
            Корзина пуста
          </p>
        )}
        <div className="flex flex-col w-full lg:flex-row">
          <ul className="space-y-4 py-4 flex-1">
            {storeItems.map(i => (
              <CartItem item={i} key={i.id} />
            ))}
          </ul>
          <div
            className={
              "bg-grey-75 shadow-lg border border-grey-100 p-3 lg:mt-3.5 lg:ml-5 lg:w-96 lg:py-4 lg:px-6 " +
              priceBlockStyle
            }
            style={{ height: "min-content" }}
          >
            <div className="flex justify-between items-center mb-3 lg:mb-5">
              <span className="lg:text-xl">Сумма заказа</span>
              <b className="text-lg lg:text-2xl">{totalPrice} грн</b>
            </div>
            <Button variant="lg" onClick={linkToCheckout}>
              Оформить заказ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
