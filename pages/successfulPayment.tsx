import { FC } from "react";

import Link from "next/link";

import SuccessIcon from "public/img/success.svg";

const SuccessfulPaymentPage: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-success w-16 my-5 lg:w-24">
        <SuccessIcon />
      </div>
      <p>Оплата прошла успешно</p>
      <Link href="/">
        <a className="underline text-base">Вернуться на главную</a>
      </Link>
    </div>
  );
};

export default SuccessfulPaymentPage;
