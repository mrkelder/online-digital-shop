import { NextPage } from "next";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootStore } from "store";
import { CartState } from "store/cartReducer";
import Head from "next/head";
import CartItem from "components/cart-page/CartItem";

// FIXME: make fetch look smooth

const CartPage: NextPage = () => {
  const storeItems = useSelector<RootStore>(
    store => store.cart.items
  ) as CartState["items"];

  const totalPrice = 0;

  return (
    <div className="py-3 px-3">
      <Head>
        <title>Корзина</title>
      </Head>

      <Link href="/catalog">
        <a className="underline lg:text-base">Продолжить покупки</a>
      </Link>
      <div className="flex flex-col items-center">
        <h1 className="mt-2 lg:mt-4 lg:mb-2">Корзина</h1>
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
        <div className="flex flex-col w-full">
          <ul className="space-y-4 py-4">
            {storeItems.map(i => (
              <CartItem item={i} key={i.id} />
            ))}
          </ul>
          <div>Купить и бла бла бла</div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
