import { FC } from "react";

import Image from "next/image";

import Input from "components/Input";
import msIcon from "public/img/mastercard.png";
import visaIcon from "public/img/visa.png";
import { FormData } from "utils/validation/checkout";

interface Props {
  info: Pick<FormData, "number" | "date" | "pin">;
  validation: OptionsFlags<Pick<FormData, "number" | "date" | "pin">>;
}

const Card: FC<Props> = ({ info, validation }) => {
  const showErrorMessageStyle = Object.values(validation).find(i => i)
    ? "inline"
    : "hidden";
  return (
    <div>
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
          <Input
            name="number"
            paddingClass="py-1 px-1"
            borderClass="border border-grey-500"
            placeholder="XXXX XXXX XXXX XXXX"
            maxLength={19}
            defaultValue={info.number}
            error={validation.number}
            required
          />
        </div>
        <div className="flex justify-between space-x-3.5">
          <div>
            <span className="text-base">Дата</span>
            <Input
              name="date"
              paddingClass="py-1 px-1"
              borderClass="border border-grey-500"
              placeholder="MM/YY"
              maxLength={5}
              defaultValue={info.date}
              error={validation.date}
              required
            />
          </div>
          <div>
            <span className="text-base">Пин</span>
            <Input
              name="pin"
              paddingClass="py-1 px-1"
              borderClass="border border-grey-500"
              placeholder="XXX"
              maxLength={3}
              defaultValue={info.pin}
              error={validation.pin}
              required
            />
          </div>
        </div>
      </div>
      <div className="h-6">
        <b className={"text-red " + showErrorMessageStyle}>
          Введены некоректные данные
        </b>
      </div>
    </div>
  );
};

export default Card;
