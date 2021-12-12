import {
  FC,
  useState,
  SetStateAction,
  Dispatch,
  MouseEvent,
  TouchEvent,
  useReducer,
  ReducerState,
  ReducerAction
} from "react";
import Logo from "public/img/logo.svg";
import MenuIcon from "public/img/menu.svg";
import SearchIcon from "public/img/search.svg";
import BurgerIcon from "public/img/burger.svg";
import ArrowIcon from "public/img/arrow.svg";
import GeoIcon from "public/img/geo-point.svg";
import CartIcon from "public/img/cart.svg";
import CrossIcon from "public/img/cross.svg";
import Input from "components/Input";
import Link from "next/link";

const staticLinks = [
  { name: "Доставка и оплата", link: "/" },
  { name: "Гарантия", link: "/" },
  { name: "Акции", link: "/" },
  { name: "Магазины", link: "/" }
];

// FIXME: decomposition

const Dialog: FC<{
  opened: boolean;
  onClose: () => void;
}> = ({ children, opened, onClose }) => {
  const variant = opened ? "block" : "hidden";

  const closeDialog = (e: MouseEvent | TouchEvent) => {
    onClose();
  };

  const stopPropagation = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`absolute bg-grey-transparent w-screen h-screen top-0 left-0 ${variant}`}
      onClick={closeDialog}
    >
      <div onClick={stopPropagation}>{children}</div>
    </div>
  );
};

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

const Product: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button className="flex py-3 px-5 items-center w-full" onClick={onClick}>
      <span className="mr-5 text-xs">icon</span>
      <p className="flex-1 text-left text-base">Телефоны</p>
      <span className="text-grey-400 transform rotate-180 w-2">
        <ArrowIcon />
      </span>
    </button>
  );
};

const SubCategory: FC<{ isOpened: boolean; closeSubMenu: () => void }> = ({
  isOpened,
  closeSubMenu
}) => {
  const translate = isOpened ? "translate-x-0" : "translate-x-full";
  return (
    <div
      className={`absolute top-0 left-0 w-full h-screen bg-white z-20 transition-transform transform ${translate}`}
    >
      <div className="bg-red text-white h-14 flex justify-center items-center relative">
        <button className="w-3 absolute left-4" onClick={closeSubMenu}>
          <ArrowIcon />
        </button>
        <span className="font-light text-lg">Каталог </span>
      </div>
      <Product />
    </div>
  );
};

// 0 - closed
// 1 - menu is opened
// 2 - sub category is opened

type MenuState = 0 | 1 | 2;

const DEFAULT_MENU_STATE: MenuState = 0;

type MenuActions = "close" | "open-menu" | "open-sub-menu";

type MenuAction = { type: MenuActions };

function menuReducer(state: MenuState, action: MenuAction) {
  switch (action.type) {
    case "close":
      return 0;
    case "open-menu":
      return 1;
    case "open-sub-menu":
      return 2;
    default:
      throw new Error("Unexpected menu state behavior: " + process.cwd);
  }
}

const MobileMenu: FC = () => {
  const [menuState, dispatch] = useReducer(menuReducer, DEFAULT_MENU_STATE);

  function changeState(type: MenuActions) {
    return () => {
      dispatch({ type });
    };
  }

  return (
    <div className="flex items-center h-14 px-3 w-full lg:hidden">
      <Link href="/">
        <a className="text-red w-8">
          <Logo />
        </a>
      </Link>
      <button
        className="flex items-center ml-3 text-red"
        onClick={changeState("open-menu")}
      >
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
      <Dialog opened={menuState > 0} onClose={changeState("close")}>
        <div className="absolute w-4/5 h-screen bg-white flex flex-col animate-slide">
          <div className="relative overflow-hidden">
            <div className="bg-red text-white h-14 flex justify-center items-center relative">
              <button
                className="w-5 absolute left-4"
                onClick={changeState("close")}
              >
                <CrossIcon />
              </button>
              <span className="font-light text-lg">Каталог товаров</span>
            </div>
            <div className="flex flex-col overflow-y-auto flex-1">
              <Product onClick={changeState("open-sub-menu")} />
            </div>
            <SubCategory
              isOpened={menuState === 2}
              closeSubMenu={changeState("open-menu")}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const DesktopMenu: FC = () => (
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
);

const Header: FC = () => (
  <header className="flex items-center bg-white border-b border-grey-100 lg:border-b-0">
    <MobileMenu />
    <DesktopMenu />
  </header>
);

export default Header;
