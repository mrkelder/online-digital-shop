import { FC } from "react";
import YtIcon from "public/img/youtube.svg";
import InstaIcon from "public/img/instagram.svg";
import FbIcon from "public/img/facebook.svg";
import TwIcon from "public/img/twitter.svg";
import ContentWrapper from "components/ContentWrapper";
import Link from "next/link";

const socialMedias = [
  {
    link: "https://www.youtube.com/channel/UCca4LDwZ0UFczThXXqMa0BA",
    icon: <YtIcon />
  },
  { link: "https://www.instagram.com/vodafone_ukraine/", icon: <InstaIcon /> },
  { link: "https://www.facebook.com/VFUkraine/", icon: <FbIcon /> },
  { link: "https://twitter.com/vodafone_ua", icon: <TwIcon /> }
];

const staticLinks = [
  {
    name: "Интернет-магазин",
    postiion: "first",
    items: [
      { name: "Про магазин", link: "/" },
      { name: "Магазины", link: "/" },
      { name: "Акции", link: "/" },
      { name: "Контакты", link: "/" }
    ]
  },
  {
    name: "Помощь покупателю",
    postiion: "between",
    items: [
      { name: "Доставка и оплата", link: "/" },
      { name: "Возврат товара", link: "/" },
      { name: "Гарантия", link: "/" }
    ]
  },
  {
    name: "Сервисы",
    postiion: "last",
    items: [
      { name: "Кредит", link: "/" },
      { name: "Тарифы", link: "/" }
    ]
  }
];

const Footer: FC = () => {
  return (
    <footer className="bg-grey-650 py-5 px-3 lg:px-12 text-white lg:py-10">
      <ul className="grid max-w-7xl mx-auto grid-cols-1 lg:grid-cols-4 lg:gap-x-10">
        <li>
          <ul className="flex flex-col space-y-5 lg:pr-7 lg:space-y-3">
            <li>
              <ul className="flex justify-between">
                {socialMedias.map((i, index) => (
                  <li key={`social_${index}`}>
                    <a
                      href={i.link}
                      className="w-8 block lg:w-5"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {i.icon}
                    </a>
                  </li>
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
        </li>
        <li className="mt-3 lg:hidden">
          {staticLinks.map(i => (
            <ContentWrapper
              key={i.name}
              text={i.name}
              position={i.postiion as "first" | "last" | "between"}
              theme="dark"
            >
              <div className="flex flex-col divide-y divide-grey-300">
                {i.items.map(item => (
                  <Link key={item.name} href={item.link}>
                    <a className="bg-grey-500 py-1.5 text-base px-3">
                      {item.name}
                    </a>
                  </Link>
                ))}
              </div>
            </ContentWrapper>
          ))}
        </li>
        {staticLinks.map(i => (
          <li className="hidden lg:block" key={i.name}>
            <h2 className="text-2xl font-bold mb-1">{i.name}</h2>
            <ul className="space-y-1">
              {i.items.map(item => (
                <li key={item.name}>
                  <Link href={item.link}>
                    <a className="text-base hover:underline">{item.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </footer>
  );
};

export default Footer;
