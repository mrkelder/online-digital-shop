import { FC } from "react";

import Image from "next/image";

import newsletterIcon from "public/img/newsletter.webp";

import Button from "./Button";
import Input from "./Input";

const MailNotification: FC = () => {
  return (
    <div className="h-64 bg-grey-500 flex items-center justify-center relative sm:justify-start lg:h-56">
      <div className="relative w-full h-full opacity-40">
        <Image
          src={newsletterIcon}
          alt="Новости"
          layout="fill"
          objectFit="contain"
          objectPosition="100%"
        />
      </div>
      <div className="absolute w-3/4 max-w-sm ml-3.5 lg:ml-10 lg:max-w-max">
        <div className="relative">
          <h2 className="text-white text-center mb-2">
            Следите за последними новостями и акциями
          </h2>
          <div className="lg:max-w-sm">
            <Input type="email" placeholder="Email" />
          </div>
          <div className="mt-2 lg:max-w-sm">
            <Button variant="lg">Подписаться</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailNotification;
