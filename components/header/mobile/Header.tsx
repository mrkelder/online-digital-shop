import { FC, useContext, useReducer, useState } from "react";
import Link from "next/link";
import Tab from "./Tab";
import Dialog from "./Dialog";
import SubCategory from "./SubCategory";
import Logo from "public/img/logo.svg";
import MenuIcon from "public/img/menu.svg";
import BurgerIcon from "public/img/burger.svg";
import SearchIcon from "public/img/search.svg";
import CrossIcon from "public/img/cross.svg";
import { FirebaseContext } from "utils/firebase";

/**
 * @type {0} - menu is closed
 * @type {1} - menu is opened
 * @type {2} - sub category is closed
 */

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

const MobileMenu: FC<{ categories: Category[] }> = ({ categories }) => {
  // TODO: add loading spinner while data is being fetched
  const firebase = useContext(FirebaseContext);
  const [menuState, dispatch] = useReducer(menuReducer, DEFAULT_MENU_STATE);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  async function switchSubCategories(category: string) {
    const data = await firebase.getSubCategories(category);
    setSubCategories(data);
  }

  function changeState(type: MenuActions) {
    return () => {
      dispatch({ type });
    };
  }

  async function TabClick(categoryId: string) {
    switchSubCategories(categoryId);
    changeState("open-sub-menu")();
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
              {categories.map(i => (
                <Tab
                  name={i.name}
                  key={i.id}
                  onClick={() => TabClick(i.id)}
                  showIcon
                />
              ))}
            </div>
            <SubCategory
              isOpened={menuState === 2}
              closeSubMenu={changeState("open-menu")}
              closeMenu={changeState("close")}
              {...{ subCategories }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default MobileMenu;
