import { FC, useEffect, useState } from "react";

import useMatchMedia from "hooks/useMatchMedia";
import { GetCategoriesResponse } from "types/api";

import DesktopMenu from "./desktop/Header";
import MobileMenu from "./mobile/Header";

const Header: FC = () => {
  const [categories, setCategories] = useState<GetCategoriesResponse>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const { isMobile, isLoaded } = useMatchMedia();

  useEffect(() => {
    async function fetchCategories() {
      setCategoriesLoading(true);
      const categoriesFetch = await fetch(
        process.env.NEXT_PUBLIC_HOSTNAME + "/api/getCategory"
      );

      setCategories(await categoriesFetch.json());
      setCategoriesLoading(false);
    }

    fetchCategories();
  }, []);

  return (
    <>
      <header
        id="header_block"
        className="flex items-center bg-white border-b border-grey-100 lg:border-b-0"
      >
        {isLoaded && (
          <>
            {isMobile ? (
              <MobileMenu
                categories={categories}
                isLoading={categoriesLoading}
              />
            ) : (
              <DesktopMenu
                categories={categories}
                isLoading={categoriesLoading}
              />
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
