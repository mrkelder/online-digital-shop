import { FC } from "react";

const Layout: FC = ({ children }) => (
  <>
    <header></header>
    <main>{children}</main>
    <footer></footer>
  </>
);

export default Layout;
