import { FC } from "react";

import Link from "next/link";

import useLanguage from "hooks/useLanguage";
import SuccessIcon from "public/img/success.svg";

const SuccessfulPaymentPage: FC = () => {
  const { langVariant } = useLanguage();

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
