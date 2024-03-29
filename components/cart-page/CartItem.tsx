import { Dispatch, FC } from "react";

import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";

import useLanguage from "hooks/useLanguage";
import CrossIcon from "public/img/cross.svg";
import styles from "styles/cart-item.module.css";
import { ReduxCartProduct, CartActions } from "types/cart-reducer";

interface Props {
  item: ReduxCartProduct;
}

const CartItem: FC<Props> = ({ item }) => {
  const { langVariant } = useLanguage();

  const dispatch = useDispatch<Dispatch<CartActions>>();

  function validatePrice(price: number): string {
    const MAX_VALID_PRICE = 999999;
    if (price > MAX_VALID_PRICE) {
      return "+" + MAX_VALID_PRICE;
    }
    return price.toString();
  }

  function validateQuantity(quantity: number): string {
    const MAX_VALID_QUANTITY = 9999;
    if (quantity > MAX_VALID_QUANTITY) {
      return "+" + MAX_VALID_QUANTITY;
    }
    return quantity.toString();
  }

  const removeItem = () => {
    dispatch({ type: "cart/removeItem", payload: item._id });
  };

  const incItemQuantity = () => {
    dispatch({
      type: "cart/changeQuantity",
      payload: { id: item._id, quantity: item.quantity + 1 }
    });
  };

  const decItemQuantity = () => {
    dispatch({
      type: "cart/changeQuantity",
      payload: { id: item._id, quantity: item.quantity - 1 }
    });
  };

  return (
    <li
      className="box-shadow bg-white py-2 px-1 flex"
      itemScope
      itemType="https://schema.org/OfferForPurchase"
    >
      <div className="relative w-16 h-16">
        <Image
          src={(process.env.NEXT_PUBLIC_STATIC_HOST as string) + item.photo}
          alt={langVariant("Фото товару", "Фото товара")}
          layout="fill"
          objectFit="contain"
          objectPosition="50%"
          priority
        />
      </div>
      <div className="flex-1 flex flex-col px-2 relative lg:flex-row lg:items-center">
        <div className="pr-4 lg:w-2/4">
          <Link href={`/products/${item._id}`}>
            <a className="text-sm lg:text-lg" itemProp="url">
              {item.name}
            </a>
          </Link>
        </div>
        <div className="flex justify-between items-center mt-3.5 lg:mt-0 lg:mr-10 lg:ml-auto lg:w-2/4">
          <div className="flex items-center lg:mr-16">
            <button
              className={styles["cart-item-amount-chooser"]}
              onClick={decItemQuantity}
            >
              -
            </button>
            <p className="px-2 text-base">{validateQuantity(item.quantity)}</p>
            <button
              className={styles["cart-item-amount-chooser"]}
              onClick={incItemQuantity}
            >
              +
            </button>
          </div>
          <p className="text-red text-sm lg:text-grey-300 lg:text-xl">
            {validatePrice(item.price * item.quantity)} грн
          </p>
        </div>
        <button
          className="w-3 text-red absolute right-1.5 top-1 lg:top-auto lg:right-3 lg:w-4"
          onClick={removeItem}
        >
          <CrossIcon />
        </button>
      </div>
    </li>
  );
};

export default CartItem;
