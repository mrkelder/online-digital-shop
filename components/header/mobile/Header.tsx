import { FC, useReducer, useState } from "react";
import Link from "next/link";
import Tab from "components/header/Tab";
import Dialog from "./Dialog";
import SubCategory from "./SubCategory";
import Loading from "./Loading";
import Logo from "public/img/logo.svg";
import MenuIcon from "public/img/menu.svg";
import BurgerIcon from "public/img/burger.svg";
import SearchIcon from "public/img/search.svg";
import CrossIcon from "public/img/cross.svg";
import ArrowIcon from "public/img/arrow.svg";
import findSubCategories from "utils/findSubCategories";

/**
 * @type {0} - menu is closed
 * @type {1} - menu is opened
 * @type {2} - sub category is closed
 */

// TODO: close menu when a user is getting out (like native mobile apps do)

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

const functionalPages = [
  { name: "На главную", link: "/" },
  { name: "Корзина", link: "/cart" }
];

const staticPages = [
  { name: "Доставка и оплата", link: "/shipping" },
  { name: "Гарантия", link: "/guarantee" },
  { name: "Магазины", link: "/shops" }
];

interface Props {
  catalogInfo: CatalogInfo;
  isLoading: boolean;
}

const MobileMenu: FC<Props> = ({ catalogInfo, isLoading }) => {
  const [menuState, dispatch] = useReducer(menuReducer, DEFAULT_MENU_STATE);
  const [navState, setNavState] = useState(false);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const switchSubCategories = (categoryId: string) => {
    const data = findSubCategories(catalogInfo, categoryId);
    setSubCategories(data);
  };

  function changeState(type: MenuActions) {
    return () => {
      dispatch({ type });
    };
  }

  function TabClick(categoryId: string) {
    return () => {
      switchSubCategories(categoryId);
      changeState("open-sub-menu")();
    };
  }

  const toggleNav = () => setNavState(!navState);

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
      <button className="text-grey-300 w-5" onClick={toggleNav}>
        <BurgerIcon />
      </button>
      <Dialog opened={menuState > 0} onClose={changeState("close")}>
        <div className="absolute w-4/5 h-screen bg-white flex flex-col animate-slide-left">
          <div className="relative overflow-hidden h-full">
            <div className="bg-red text-white h-14 flex justify-center items-center relative">
              <button
                className="w-5 absolute left-4"
                onClick={changeState("close")}
              >
                <CrossIcon />
              </button>
              <span className="font-light text-lg">Каталог товаров</span>
            </div>
            <div className="flex flex-col overflow-y-auto h-full flex-1 relative">
              <Loading {...{ isLoading }} />
              {catalogInfo.categories &&
                catalogInfo.categories.map(i => (
                  <Tab
                    name={i.name}
                    key={i.id}
                    onClick={TabClick(i.id)}
                    showIcon
                  />
                ))}
            </div>
            {subCategories && (
              <SubCategory
                isOpened={menuState === 2}
                closeSubMenu={changeState("open-menu")}
                closeMenu={changeState("close")}
                {...{ subCategories }}
              />
            )}
          </div>
        </div>
      </Dialog>
      <Dialog opened={navState} onClose={toggleNav}>
        <nav className="absolute w-4/5 h-screen right-0 bg-white flex flex-col animate-slide-right pt-4">
          <div className="flex justify-end px-3.5">
            {/* justify-between */}
            {/* Account block */}
            <button className="w-5 text-grey-600" onClick={toggleNav}>
              <CrossIcon />
            </button>
          </div>
          <div className="flex divide-x divide-grey-300 border-t border-b border-grey-100 py-2 my-2">
            <button className="flex-1 text-left text-grey-400 text-sm pl-5">
              Киев
            </button>
            <div className="group flex-1 relative">
              <button className="text-left text-grey-400 text-sm px-5 flex items-center justify-between w-full">
                RU
                <span className="w-1.5 transform rotate-90 group-hover:-rotate-90">
                  <ArrowIcon />
                </span>
              </button>
              <button className="absolute w-full bg-white z-50 text-left text-grey-400 text-sm px-5 py-3 shadow-md top-8 hidden group-hover:block">
                UA
              </button>
            </div>
          </div>
          <ul className="mx-3.5 mt-2 space-y-1">
            {functionalPages.map(i => (
              <li key={i.name} onClick={toggleNav}>
                <Link href={i.link}>
                  <a className="text-grey-650 text-lg">{i.name}</a>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-3 py-4 bg-grey-75 border-t border-b border-grey-100 pl-10 space-y-2">
            {staticPages.map(i => (
              <li key={i.name} onClick={toggleNav}>
                <Link href={i.link}>
                  <a className="font-regular text-grey-650 text-lg">{i.name}</a>
                </Link>
              </li>
            ))}
          </ul>
          <div className="my-auto mb-0 py-2 px-3.5">
            <a href="tel:+380991234567" className="font-light">
              099 123 45 67
            </a>
          </div>
        </nav>
      </Dialog>
    </div>
  );
};

export default MobileMenu;
