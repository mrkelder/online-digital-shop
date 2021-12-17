import { FC, useEffect, useState } from "react";
import Input from "components/Input";
import Cart from "./Cart";
import Catalog from "./Catalog";
import Link from "next/link";
import GeoIcon from "public/img/geo-point.svg";
import Logo from "public/img/logo.svg";
import ArrowIcon from "public/img/arrow.svg";

const staticLinks = [
  { name: "Доставка и оплата", link: "/" },
  { name: "Гарантия", link: "/" },
  { name: "Акции", link: "/" },
  { name: "Магазины", link: "/" }
];

const DesktopMenu: FC = () => {
  const [isCatalogOpened, setIsCatalogOpened] = useState(false);

  const toggleCatalog = () => {
    setIsCatalogOpened(!isCatalogOpened);
  };

  useEffect(() => {
    function handleCatalogClose() {
      if (isCatalogOpened) setIsCatalogOpened(false);
    }

    addEventListener("close-catalog", handleCatalogClose);
    return () => {
      removeEventListener("close-catalog", handleCatalogClose);
    };
  }, [isCatalogOpened]);

  // TODO: close catalog when a user clicks empty space

  return (
    <div className="hidden lg:flex flex-col w-full">
      <div className="bg-grey-400 text-white w-full px-12">
        <nav className="flex justify-between h-7 max-w-7xl mx-auto">
          <div className="flex items-center space-x-7">
            {staticLinks.map(({ name, link }) => (
              <Link href={link} key={name}>
                <a className="hover:underline text-base">{name}</a>
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-8">
            <a href="tel:+380991234567" className="text-base">
              099 123 45 67
            </a>
            <button className="text-white flex items-center">
              <span className="w-2.5 mr-1">
                <GeoIcon />
              </span>
              <span className="text-base">Киев</span>
            </button>

            <div className="group relative">
              <button className="text-white flex items-center ">
                <span className="text-base">Рус</span>
                <span className="w-1.5 ml-1.5 transform rotate-90 group-hover:-rotate-90">
                  <ArrowIcon />
                </span>
              </button>
              <button className="hidden group-hover:block top-6 bg-grey-400 absolute p-1 text-base z-10">
                Укр
              </button>
            </div>
          </div>
        </nav>
      </div>
      <div className="bg-white h-14 px-12">
        <div className="flex justify-between items-center h-full max-w-7xl mx-auto">
          <div className="flex items-center min-w-max mr-2">
            <Link href="/">
              <a className="text-red w-10 mr-7">
                <Logo />
              </a>
            </Link>
            <button
              className="text-2xl text-grey-400 font-light"
              onClick={toggleCatalog}
            >
              Каталог товаров
            </button>
            <Catalog isOpened={isCatalogOpened} />
          </div>
          <div className="flex-1 mx-5">
            <Input type="search" />
          </div>
          <Cart items={3} />
        </div>
      </div>
    </div>
  );
};

export default DesktopMenu;
