import { FC, useContext, useEffect, useState } from "react";

import useMatchMedia from "hooks/useMatchMedia";
import categoriesToSubCategoryIds from "utils/dto/categoriesToSubCategoryIds";
import { FirebaseContext } from "utils/firebase";

import DesktopMenu from "./desktop/Header";
import MobileMenu from "./mobile/Header";

const Header: FC = () => {
  const firebase = useContext(FirebaseContext);
  const [catalogInfo, setCatalogInfo] = useState<CatalogInfo>({
    categories: null,
    subcategories: null
  });
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const { isMobile, isLoaded } = useMatchMedia();

  useEffect(() => {
    async function fetch() {
      setCategoriesLoading(true);
      const categories = await firebase.getAllDocumentsInCollection<Category>(
        "categories"
      );

      const subcategories = await firebase.getDocumentsByIds<SubCategory>(
        "subcategories",
        categoriesToSubCategoryIds(categories)
      );

      setCatalogInfo({ categories, subcategories });
      setCategoriesLoading(false);
    }

    fetch();
  }, [firebase]);

  return (
    <>
      <header
        id="header_block"
        className="flex items-center bg-white border-b border-grey-100 lg:border-b-0"
      >
        {isLoaded && (
          <>
            {isMobile ? (
              <MobileMenu {...{ catalogInfo }} isLoading={categoriesLoading} />
            ) : (
              <DesktopMenu {...{ catalogInfo }} isLoading={categoriesLoading} />
            )}
          </>
        )}
      </header>

      <style jsx>{`
        #header_block {
          min-height: 56px;
        }

        @media (min-width: 1024px) {
          #header_block {
            min-height: 84px;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
