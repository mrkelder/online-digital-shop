import { FC } from "react";
import Header from "components/header/Header";

const Layout: FC = ({ children }) => (
  <>
    <Header />
    <main className="max-w-7xl mx-auto">{children}</main>
    <footer></footer>
  </>
);

export default Layout;
