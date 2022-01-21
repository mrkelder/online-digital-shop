import { FC, useContext, useEffect, useState } from "react";
import MobileMenu from "./mobile/Header";
import DesktopMenu from "./desktop/Header";
import { FirebaseContext } from "utils/firebase";
import categoriesToSubCategoryIds from "utils/dto/categoriesToSubCategoryIds";

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
      setCategoriesLoading(true);
      const categories = await firebase.getAllDocumentsInCollection<Category>(
        "categories"
      );

      const subcategories = await firebase.getDocumentsById<SubCategory>(
        "subcategories",
        categoriesToSubCategoryIds(categories)
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
