import { FC, useEffect } from "react";

import Link from "next/link";
import { useDispatch } from "react-redux";

import { AMOUNT_OF_ITEMS_IN_CART } from "constants/cookie-names";
import useLanguage from "hooks/useLanguage";
import SuccessIcon from "public/img/success.svg";
import Cookie from "utils/Cookie";

const SuccessfulPaymentPage: FC = () => {
  const { langVariant } = useLanguage();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "cart/restore" });
    Cookie.setCookie(AMOUNT_OF_ITEMS_IN_CART, "0");
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-success w-16 my-5 lg:w-24">
        <SuccessIcon />
      </div>
      <p>{langVariant("Оплата пройшла успішно", "Оплата прошла успешно")}</p>
      <Link href="/">
        <a className="underline text-base">
          {langVariant("Повернутися на головну", "Вернуться на главную")}
        </a>
      </Link>
    </div>
  );
};

export default SuccessfulPaymentPage;
