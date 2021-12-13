import { FC } from "react";
import Header from "components/header/Header";

const Layout: FC = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <footer></footer>
  </>
);

export default Layout;
