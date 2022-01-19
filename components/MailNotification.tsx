import { FC } from "react";
import Input from "./Input";
import newsletterIcon from "public/img/newsletter.webp";
import Image from "next/image";
import Button from "./Button";

const MailNotification: FC = () => {
  return (
    <div className="py-10 bg-grey-500 flex items-center justify-center relative sm:justify-start">
      <div className="absolute w-full h-full opacity-40">
        <Image
          src={newsletterIcon}
          alt="Новости"
          layout="fill"
          objectFit="contain"
          objectPosition="100%"
        />
      </div>
      <div className="w-3/4 relative max-w-sm ml-3.5 lg:ml-10 lg:max-w-max">
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
  );
};

export default MailNotification;
