import { useCallback, useEffect, useState } from "react";

import { GetServerSideProps, NextPage } from "next";
import { NextRouter, useRouter } from "next/router";

import Button from "components/Button";
import Filters from "components/catalog-page/Filters";
import MetaHead from "components/meta/MetaHead";
import MobileDialog from "components/MobileDialog";
import MobileSlideMenu from "components/MobileSlideMenu";
import Card from "components/product-card/Card";
import {
  ITEMS_PER_PAGE,
  DEFAULT_PAGE,
  CHANGE_FILTERS_EVENT_NAME
} from "constants/catalog";
import useMatchMedia from "hooks/useMatchMedia";
import CrossIcon from "public/img/cross.svg";
import { GetItemsResponse } from "types/api";
import { ChangeFiltersEventDetail } from "types/catalog";

interface Props {
  items: GetItemsResponse["items"];
  characteristics: GetItemsResponse["characteristics"];
  minPrice: number;
  maxPrice: number;
  queryPrice: { min: number; max: number };
  page: number;
  totalQuantityOfPages: number;
}

type PageNumberFromQuery = string | string[] | undefined | number;

const TITLE = "Каталог";

function checkForNumberOrString(value: any): boolean {
  return typeof value === "string" || typeof value === "number";
}

function validatePage(page: PageNumberFromQuery): number {
  // FIXME: extract
  if (checkForNumberOrString(page)) {
    return Math.max(Number(page ?? DEFAULT_PAGE), DEFAULT_PAGE);
  }
  return DEFAULT_PAGE;
}

function returnValueOrFirstArrayValue(
  value?: string | string[]
): string | undefined {
  const totalValue = Array.isArray(value) ? value[0] : value;
  return totalValue;
}

function queryStringCreator(
  subCategoryId?: string | string[],
  minPrice?: string | string[],
  maxPrice?: string | string[],
  page?: string | string[],
  c?: string | string[]
): string {
  const querySubCategoryId = returnValueOrFirstArrayValue(subCategoryId);
  const queryMinPrice = returnValueOrFirstArrayValue(minPrice);
  const queryMaxPrice = returnValueOrFirstArrayValue(maxPrice);
  const queryPagePrice = validatePage(returnValueOrFirstArrayValue(page));
  const queryCharacteristics = Array.isArray(c) ? c : [c];

  const queryArray = [
    subCategoryId ? "subCategoryId=" + querySubCategoryId : null,
    minPrice ? "min=" + queryMinPrice : null,
    maxPrice ? "max=" + queryMaxPrice : null,
    page ? "page=" + queryPagePrice : null,
    c ? queryCharacteristics.map(i => "c=" + i).join("&") : null
  ].filter(i => i);

  const queryString = queryArray.length > 0 ? "?" + queryArray.join("&") : "";

  return queryString;
}

function getQuantityOfPages(amountOfProducts: number): number {
  return Math.ceil(amountOfProducts / ITEMS_PER_PAGE);
}

const CatalogPage: NextPage<Props> = ({
  characteristics,
  minPrice,
  maxPrice,
  queryPrice,
  page,
  totalQuantityOfPages,
  items
}) => {
  // FIXME: make window size available with redux
  // FIXME: when you reload page with chosen filters they don't visually appear as chosen on the reloaded page
  // FIXME: filters can only show the items that are eligible to ALL criterias
  // TODO: when some option is not available, make it disabled

  const router = useRouter();
  const [areMobileFiltersOpened, setAreMobileFiltersOpened] = useState(false);
  const [quantityOfPages, setQuantityOfPages] = useState(totalQuantityOfPages);
  const [currentPage, setCurrentPage] = useState(page);
  const [catalog, setCatalog] = useState(items);
  const { isLoaded, isMobile } = useMatchMedia();

  const toggleMobileFilters = useCallback(
    () => setAreMobileFiltersOpened(!areMobileFiltersOpened),
    [areMobileFiltersOpened]
  );

  const paggination = buildPagination(
    currentPage,
    quantityOfPages,
    isMobile ? 5 : 7
  );

  useEffect(() => {
    function handleFilterChange(event: CustomEvent<ChangeFiltersEventDetail>) {
      const { query } = router;
      const { route, min, max, values } = event.detail;
      router.push(
        {
          href: route,
          query: {
            ...query,
            ...(minPrice !== min && { min }),
            ...(maxPrice !== max && { max }),
            c: values.map(i => `${i.id}.${i.valueIndex}`),
            page: DEFAULT_PAGE
          }
        },
        undefined,
        {
          shallow: true
        }
      );
      setCurrentPage(DEFAULT_PAGE);
    }

    addEventListener(
      CHANGE_FILTERS_EVENT_NAME,
      handleFilterChange as EventListener
    );

    return () => {
      removeEventListener(
        CHANGE_FILTERS_EVENT_NAME,
        handleFilterChange as EventListener
      );
    };
  }, [maxPrice, minPrice, router]);

  useEffect(() => {
    // FIXME: this effect fetches items for no reason
    async function handle() {
      const { subCategoryId, min, max, page, c } = router.query;
      const queryString = queryStringCreator(subCategoryId, min, max, page, c);

      const fetchCatalog = await fetch(
        process.env.NEXT_PUBLIC_HOSTNAME + "/api/getItem/" + queryString
      );

      const { items, totalQuantityOfItems }: GetItemsResponse =
        await fetchCatalog.json();

      setCatalog(items);
      setQuantityOfPages(getQuantityOfPages(totalQuantityOfItems));
    }

    handle();
  }, [router]);

  function buildPagination(
    currentpage: number,
    totalPages: number,
    maxPages: 5 | 7
  ) {
    // FIXME: make it look... better
    if (totalPages <= maxPages) {
      return [...Array(totalPages)].map((_, i) => i + 1);
    } else {
      if (currentpage < maxPages - 2) {
        if (maxPages === 5) {
          return [1, 2, 3, null, totalPages];
        } else {
          return [1, 2, 3, 4, 5, null, totalPages];
        }
      }
      if (currentpage > totalPages - (maxPages - 3)) {
        if (maxPages === 5) {
          return [1, null, totalPages - 3, totalPages - 4, totalPages];
        } else {
          return [
            1,
            null,
            totalPages - 1,
            totalPages - 2,
            totalPages - 3,
            totalPages - 4,
            totalPages
          ];
        }
      }
      if (maxPages === 5) {
        return [1, currentPage - 1, currentpage, currentPage + 1, totalPages];
      } else {
        return [
          1,
          null,
          currentpage - 1,
          currentpage,
          currentpage + 1,
          null,
          totalPages
        ];
      }
    }
  }

  function pagginatePage(pageIndex: number) {
    return () => {
      const { route, query } = router;
      router.push(
        {
          href: route,
          query: {
            ...query,
            page: pageIndex
          }
        },
        undefined,
        {
          shallow: true
        }
      );
      setCurrentPage(pageIndex);
      scroll({ top: 0, behavior: "smooth" });
    };
  }

  return (
    <div className="py-4">
      <MetaHead title={TITLE} noindex />

      {isLoaded && isMobile && (
        <MobileDialog
          opened={areMobileFiltersOpened}
          onClose={toggleMobileFilters}
        >
          <MobileSlideMenu>
            <div className="border-b border-grey-100 text-grey-600 py-3 relative flex items-center justify-center">
              <button
                className="w-5 left-4 absolute"
                onClick={toggleMobileFilters}
              >
                <CrossIcon />
              </button>
              <p className="font-bold font-light ">Фильтры</p>
            </div>
            <Filters
              queryPrice={queryPrice}
              minPrice={minPrice}
              maxPrice={maxPrice}
              characteristics={characteristics}
            />
          </MobileSlideMenu>
        </MobileDialog>
      )}

      <h1 className="text-center">{TITLE}</h1>
      <div className="flex flex-col">
        <div className="mx-auto w-56 my-3 lg:hidden">
          <Button onClick={toggleMobileFilters}>Фильтры</Button>
        </div>
        <div className="flex justify-center lg:justify-between">
          <div id="desktop-filters">
            {isLoaded && !isMobile && (
              <Filters
                queryPrice={queryPrice}
                minPrice={minPrice}
                maxPrice={maxPrice}
                characteristics={characteristics}
              />
            )}
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="grid grid-cols-1 self-center gap-10 sm:grid-cols-2">
              {catalog.map(i => (
                <Card
                  key={i._id}
                  rating={i.rating}
                  price={i.price}
                  name={i.name}
                  photo={i.photo}
                  _id={i._id}
                />
              ))}
              {catalog.length === 0 && <b>Ничего не найдено</b>}
            </div>
            <div className="flex space-x-2 my-2 lg:my-6 lg:space-x-4">
              {paggination.map((i, index) => (
                <div key={`p_${index}`}>
                  {i === null ? (
                    <button
                      className="w-10 h-10 bg-white shadow-md lg:bg-grey-100 lg:w-12 lg:h-12"
                      disabled
                    >
                      ...
                    </button>
                  ) : (
                    <button
                      className={`w-10 h-10 shadow-md lg:w-12 lg:h-12 ${
                        currentPage === i
                          ? "bg-grey-100 lg:bg-red lg:text-white"
                          : "bg-white lg:bg-grey-100"
                      }`}
                      onClick={pagginatePage(i)}
                    >
                      {i}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          #desktop-filters {
            min-width: 336px;
          }
        }
      `}</style>
    </div>
  );
};

const REDIRECT_CONFIG = {
  redirect: {
    destination: "/",
    permanent: false
  }
};

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  try {
    const { subCategoryId, min, max, page, c } = context.query;
    const actualPage = validatePage(page);

    const queryString = queryStringCreator(subCategoryId, min, max, page, c);

    const fetchCatalog = await fetch(
      process.env.NEXT_PUBLIC_HOSTNAME + "/api/getItem/" + queryString
    );

    const {
      minPrice,
      maxPrice,
      items,
      characteristics,
      totalQuantityOfItems
    }: GetItemsResponse = await fetchCatalog.json();

    return {
      props: {
        items: items ? items : [],
        characteristics,
        minPrice,
        maxPrice,
        queryPrice: {
          min: Number(min ?? minPrice),
          max: Number(max ?? maxPrice)
        },
        page: actualPage,
        totalQuantityOfPages: getQuantityOfPages(totalQuantityOfItems)
      }
    };
  } catch {
    return REDIRECT_CONFIG;
  }
};

export default CatalogPage;
