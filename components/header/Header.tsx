import { FC, useContext, useEffect, useState } from "react";
import MobileMenu from "./mobile/Header";
import DesktopMenu from "./desktop/Header";
import { FirebaseContext } from "utils/firebase";

// TODO: substitude css layout hidding with rendering

const Header: FC = () => {
  const firebase = useContext(FirebaseContext);
  const [catalogInfo, setCatalogInfo] = useState<CatalogInfo>({
    categories: null,
    subcategories: null
  });
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      let subcategoryIds: SubCategory["id"][] = [];
      setCategoriesLoading(true);
      const categories = await firebase.getAllDocumentsInCollection<Category>(
        "categories"
      );

      categories.forEach(i =>
        i.subcategories.forEach(s => subcategoryIds.push(s))
      );

      const subcategories = await firebase.getDocumentsById<SubCategory>(
        "subcategories",
        subcategoryIds
      );

      setCatalogInfo({ categories, subcategories });
      setCategoriesLoading(false);
    }

    fetch();
  }, [firebase]);

  return (
    <header className="flex items-center bg-white border-b border-grey-100 lg:border-b-0">
      <MobileMenu {...{ catalogInfo }} isLoading={categoriesLoading} />
      <DesktopMenu {...{ catalogInfo }} isLoading={categoriesLoading} />
    </header>
  );
};

export default Header;
