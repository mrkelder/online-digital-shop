import { FC, useContext, useEffect, useState } from "react";
import MobileMenu from "./mobile/Header";
import DesktopMenu from "./desktop/Header";
import { FirebaseContext } from "utils/firebase";

// TODO: substitude css layout hidding with rendering

const Header: FC = () => {
  const firebase = useContext(FirebaseContext);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetch() {
      const data = await firebase.getCategories();
      setCategories(data);
    }

    fetch();
  }, [firebase]);

  return (
    <header className="flex items-center bg-white border-b border-grey-100 lg:border-b-0">
      <MobileMenu {...{ categories }} />
      <DesktopMenu />
    </header>
  );
};

export default Header;
