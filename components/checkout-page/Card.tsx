import { FC } from "react";
import msIcon from "public/img/mastercard.png";
import visaIcon from "public/img/visa.png";
import Image from "next/image";
import Input from "components/Input";

const Card: FC = () => {
  return (
    <div className="shadow-md max-w-sm bg-white border-grey-300 border rounded p-4 space-y-2">
      <div className="flex items-center justify-center space-x-4">
        <div className="w-10">
          <Image src={msIcon} alt="Mastercard" />
        </div>
        <div className="w-10">
          <Image src={visaIcon} alt="VISA" />
        </div>
      </div>
      <div>
        <span className="text-base">Номер карты</span>
        <div className="flex justify-between space-x-3.5">
          <Input
            name="card-number"
            paddingClass="py-1 px-1"
            borderClass="border border-grey-500"
            placeholder="XXXX"
            maxLength={4}
          />
          <Input
            name="card-number"
            paddingClass="py-1 px-1"
            borderClass="border border-grey-500"
            placeholder="XXXX"
            maxLength={4}
          />
          <Input
            name="card-number"
            paddingClass="py-1 px-1"
            borderClass="border border-grey-500"
            placeholder="XXXX"
            maxLength={4}
          />
          <Input
            name="card-number"
            paddingClass="py-1 px-1"
            borderClass="border border-grey-500"
            placeholder="XXXX"
            maxLength={4}
          />
        </div>
      </div>
      <div className="flex justify-between space-x-3.5">
        <div>
          <span className="text-base">Дата</span>
          <Input
            name="expiration-time"
            paddingClass="py-1 px-1"
            borderClass="border border-grey-500"
            placeholder="MM/YY"
            maxLength={5}
          />
        </div>
        <div>
          <span className="text-base">Пин</span>
          <Input
            name="security-code"
            paddingClass="py-1 px-1"
            borderClass="border border-grey-500"
            placeholder="XXX"
            maxLength={3}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
