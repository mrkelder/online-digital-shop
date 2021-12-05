import type { FC } from "react";
import Logo from "public/img/logo.svg";
import MenuIcon from "public/img/menu.svg";
import SearchIcon from "public/img/search.svg";
import BurgerIcon from "public/img/burger.svg";
import ArrowIcon from "public/img/arrow.svg";
import GeoIcon from "public/img/geo-point.svg";
import CartIcon from "public/img/cart.svg";
import Input from "components/Input";
import Link from "next/link";

const staticLinks = [
  { name: "Доставка и оплата", link: "/" },
  { name: "Гарантия", link: "/" },
  { name: "Акции", link: "/" },
  { name: "Магазины", link: "/" }
];

const Cart: FC<{ items?: number }> = ({ items }) => {
  return (
    <button className="text-grey-300 w-9 relative">
      <div
        className={`absolute w-4 h-4 bg-red -right-1.5 -top-1 rounded-full text-white font-regular text-xs
        ${items ? "block" : "hidden"}`}
      >
        {Math.min(items as number, 99)}
      </div>
      <CartIcon />
    </button>
  );
};

const Header: FC = () => {
  return (
    <header className="flex items-center bg-white border-b border-grey-100 lg:border-b-0">
      <div className="flex items-center h-14 px-3 w-full lg:hidden">
        <Link href="/">
          <a className="text-red w-8">
            <Logo />
          </a>
        </Link>
        <button className="flex items-center ml-3 text-red">
          <span className="w-3 mr-1">
            <MenuIcon />
          </span>
          <span className="text-base">Каталог товаров</span>
        </button>
        <div className="flex-1" />
        <button className="text-grey-300 w-5 mr-4">
          <SearchIcon />
        </button>
        <button className="text-grey-300 w-5">
          <BurgerIcon />
        </button>
      </div>
      <div className="hidden lg:flex flex-col w-full">
        <div className="bg-grey-400 text-white w-full px-12">
          <div className="flex justify-between h-7 max-w-7xl mx-auto">
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
          </div>
        </div>
        <div className="bg-white h-14 px-12">
          <div className="flex justify-between items-center h-full max-w-7xl mx-auto">
            <div className="flex items-center min-w-max mr-2">
              <Link href="/">
                <a className="text-red w-10 mr-7">
                  <Logo />
                </a>
              </Link>
              <button className="text-2xl text-grey-400 font-light">
                Каталог товаров
              </button>
            </div>
            <div className="flex-1 mx-5">
              <Input type="search" />
            </div>
            <Cart items={3} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
