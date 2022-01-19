import { FC } from "react";
import YtIcon from "public/img/youtube.svg";
import InstaIcon from "public/img/instagram.svg";
import FbIcon from "public/img/facebook.svg";
import TwIcon from "public/img/twitter.svg";

const socialMedias = [
  {
    link: "https://www.youtube.com/channel/UCca4LDwZ0UFczThXXqMa0BA",
    icon: <YtIcon />
  },
  { link: "https://www.instagram.com/vodafone_ukraine/", icon: <InstaIcon /> },
  { link: "https://www.facebook.com/VFUkraine/", icon: <FbIcon /> },
  { link: "https://twitter.com/vodafone_ua", icon: <TwIcon /> }
];

const Footer: FC = () => {
  return (
    <footer className="bg-grey-650 py-5 px-3 lg:px-12 text-white">
      <ul className="grid grid-cols-1 space-y-5">
        <li>
          <ul className="flex justify-between">
            {socialMedias.map((i, index) => (
              <a
                key={`social_${index}`}
                href={i.link}
                className="w-8 block"
                target="_blank"
                rel="noreferrer"
              >
                {i.icon}
              </a>
            ))}
          </ul>
        </li>
        <li>
          <a
            href="tel:+380991234567"
            className="text-white font-light text-2xl"
          >
            099 123 45 67
          </a>
        </li>
        <li>
          <p className="text-sm">
            ООО {'"'}ВФ РИТЕЙЛ{'"'}
          </p>
          <p className="text-sm">
            Бесплатно с мобильных и стационарных по Украине
          </p>
          <p className="text-grey-300 text-sm">
            График работы контактного центра
          </p>
        </li>
        <li>
          <strong className="text-2xl font-light font-bold">
            Ежедневно
            <br />
            <time dateTime="8:00">8:00</time>
            {" - "}
            <time dateTime="23:00">23:00</time>
          </strong>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
