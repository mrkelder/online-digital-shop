import { NextPage } from "next";
import Link from "next/link";

const CartPage: NextPage = () => {
  return (
    <div className="py-3 px-3">
      <Link href="/catalog">
        <a className="underline lg:text-base">Продолжить покупки</a>
      </Link>
      <div className="flex flex-col items-center">
        <h1 className="mt-2 lg:mt-4 lg:mb-2">Корзина</h1>
        <p className="text-grey-300 text-base">
          0 товаров на сумму{" "}
          <span className="text-grey-650 font-bold text-base">0 грн</span>
        </p>
        <p className="mt-3 text-base lg:mt-16 lg:text-lg lg:font-bold">
          Корзина пуста
        </p>
      </div>
    </div>
  );
};

export default CartPage;
