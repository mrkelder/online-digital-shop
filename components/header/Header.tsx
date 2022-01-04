import { FC, useContext, useEffect, useState } from "react";
import MobileMenu from "./mobile/Header";
import DesktopMenu from "./desktop/Header";
import { FirebaseContext } from "utils/firebase";

// TODO: substitude css layout hidding with rendering

const Header: FC = () => {
  const firebase = useContext(FirebaseContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      setCategoriesLoading(true);
      const data = await firebase.getAllDocumentsInCollection<Category>(
        "categories"
      );
      setCategories(data);
      setCategoriesLoading(false);
    }

    fetch();
  }, [firebase]);

  return (
    <header className="flex items-center bg-white border-b border-grey-100 lg:border-b-0">
      <MobileMenu {...{ categories }} isLoading={categoriesLoading} />
      <DesktopMenu />
    </header>
  );
};

export default Header;
