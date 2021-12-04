import type { FC } from "react";
import Logo from "public/img/logo.svg";
import MenuIcon from "public/img/menu.svg";
import SearchIcon from "public/img/search.svg";
import BurgerIcon from "public/img/burger.svg";
import Link from "next/link";

const Header: FC = () => {
  return (
    <header className="flex items-center px-2 bg-white border-b border-grey-100 h-14">
      <Link href="/">
        <a className="text-red w-8">
          <Logo />
        </a>
      </Link>
      <button className="flex items-center ml-3 text-red text-md font-regular text-sm">
        <span className="w-3 mr-1">
          <MenuIcon />
        </span>
        Каталог товаров
      </button>
      <div className="flex-1" />
      <button className="text-grey-300 w-5 mr-4">
        <SearchIcon />
      </button>
      <button className="text-grey-300 w-5">
        <BurgerIcon />
      </button>
    </header>
  );
};

export default Header;
