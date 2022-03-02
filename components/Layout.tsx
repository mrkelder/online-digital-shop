import { FC, useEffect, useMemo, useState } from "react";

import Router from "next/router";
import NProgress from "nprogress";

import Footer from "components/footer/Footer";
import Header from "components/header/Header";
import ArrowIcon from "public/img/arrow.svg";
import "nprogress/nprogress.css";

// FIXME: make layout robust so that you don't have to specify padding at **EACH** page

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());

const Layout: FC = ({ children }) => {
  const [scroll, setScroll] = useState(0);
  const scrollTopStyle = scroll > 400 ? "flex" : "hidden";

  const memoizedHeader = useMemo(() => <Header />, []);
  const memoizedFooter = useMemo(() => <Footer />, []);

  function scrollTop() {
    scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    const handler = () => setScroll(scrollY);

    handler();
    addEventListener("scroll", handler);
    return () => {
      removeEventListener("scroll", handler);
    };
  }, []);

  return (
    <>
      <button
        className={
          "fixed z-40 bg-white border-2 border-grey-300 w-10 h-10 right-6 bottom-6 items-center justify-center lg:right-12 lg:bottom-12 " +
          scrollTopStyle
        }
        onClick={scrollTop}
      >
        <span className="w-2.5 transform rotate-90">
          <ArrowIcon />
        </span>
      </button>
      {memoizedHeader}
      <main className="max-w-7xl m-3 min-h-screen lg:mx-auto">{children}</main>
      {memoizedFooter}
    </>
  );
};

export default Layout;
