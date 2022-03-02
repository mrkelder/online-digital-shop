import { FC } from "react";

import CartIcon from "public/img/cart.svg";

const Cart: FC<{ items?: number }> = ({ items }) => {
  return (
    <button className="text-grey-300 w-9 relative">
      <div
        className={`absolute w-4 h-4 bg-red -right-1.5 -top-1 rounded-full text-white font-regular text-xs
        ${items ? "block" : "hidden"}`}
      >
        {Math.min(items as number, 99)}
      </div>
      <CartIcon />
    </button>
  );
};

export default Cart;
