import { FC } from "react";
import MobileMenu from "./mobile/Header";
import DesktopMenu from "./desktop/Header";

// TODO: substitude css layout hidding with rendering

const Header: FC = () => (
  <header className="flex items-center bg-white border-b border-grey-100 lg:border-b-0">
    <MobileMenu />
    <DesktopMenu />
  </header>
);

export default Header;