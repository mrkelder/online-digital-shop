import { useCallback, useEffect, useState } from "react";

import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

import Button from "components/Button";
import Filters from "components/catalog-page/Filters";
import MetaHead from "components/meta/MetaHead";
import MobileDialog from "components/MobileDialog";
import MobileSlideMenu from "components/MobileSlideMenu";
import Card from "components/product-card/Card";
import useMatchMedia from "hooks/useMatchMedia";
import CrossIcon from "public/img/cross.svg";
import fetchCatalog, { CharacteristicQuery } from "utils/fetchCatalog";
import Firebase from "utils/firebase";

interface Props {
  products: FirebaseProduct[];
  allProducts: FirebaseProduct[];
  characteristics: Characteristic[];
  minPrice: number;
  maxPrice: number;
  queryPrice: { min: number; max: number };
  page: number;
  totalQuantitiyOfPages: number;
}

type PageNumberFromQuery = string | string[] | undefined | number;

// FIXME: DRY
interface ChangeFiltersEventDetail {
  min: number;
  max: number;
  route: string;
  values: ReadonlyArray<CharacteristicQuery>;
}

const TITLE = "Каталог";
const ITEMS_PER_PAGE = 3;
const FIRST_PAGE = 1;
const DEFAULT_PAGE = FIRST_PAGE;
const DEFAULT_SKIP = DEFAULT_PAGE - 1;
const DEFAULT_LIMIT = DEFAULT_PAGE * ITEMS_PER_PAGE;
const CHANGE_FILTERS_EVENT_NAME = "change-filters";

function getAmountOfPages(amountOfProducts: number): number {
  return Math.ceil(amountOfProducts / ITEMS_PER_PAGE);
}

function validatePage(page: PageNumberFromQuery): number {
  if (checkForNumberOrString(page)) {
    return Math.max(Number(page ?? DEFAULT_PAGE), FIRST_PAGE);
  }
  return DEFAULT_PAGE;
}

function getSkipAndLimitValues(page: PageNumberFromQuery): {
  skip: number;
  limit: number;
} {
  if (checkForNumberOrString(page)) {
    const skip = (Number(page) - 1) * ITEMS_PER_PAGE;
    const limit = Number(page) * ITEMS_PER_PAGE;
    return {
      skip: Math.max(skip, DEFAULT_SKIP),
      limit: Math.max(limit, DEFAULT_LIMIT)
    };
  }
  return { skip: DEFAULT_SKIP, limit: DEFAULT_LIMIT };
}

function checkForNumberOrString(value: any): boolean {
  return typeof value === "string" || typeof value === "number";
}

const CatalogPage: NextPage<Props> = ({
  products,
  characteristics,
  allProducts,
  minPrice,
  maxPrice,
  queryPrice,
  page,
  totalQuantitiyOfPages
}) => {
  // FIXME: make window size available with redux
  // FIXME: when you reload page with chosen filters they don't visually appear as chosen on the reloaded page
  // FIXME: filters can only show the items that are eligible to ALL criterias

  const router = useRouter();
  const [areMobileFiltersOpened, setAreMobileFiltersOpened] = useState(false);
  const [quantityOfPages, setQuantityOfPages] = useState(totalQuantitiyOfPages);
  const [currentPage, setCurrentPage] = useState(page);
  const [catalog, setCatalog] = useState<FirebaseProduct[]>(products);
  const { isMobile } = useMatchMedia();

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
            page: FIRST_PAGE
          }
        },
        undefined,
        {
          shallow: true
        }
      );
      setCurrentPage(FIRST_PAGE);
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
    async function handle() {
      const page = validatePage(router.query.page);
      const { skip, limit } = getSkipAndLimitValues(page);

      const { items, amountOfItems } = await fetchCatalog(
        router.query,
        minPrice,
        maxPrice,
        allProducts,
        skip,
        limit
      );
      setCatalog(items);
      setQuantityOfPages(getAmountOfPages(amountOfItems));
    }
    handle();
  }, [router.query, maxPrice, minPrice, allProducts]);

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
      <MetaHead title={TITLE} />

      {isMobile && (
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
              {...{
                queryPrice,
                minPrice,
                maxPrice,
                characteristics
              }}
              filterEventName={CHANGE_FILTERS_EVENT_NAME}
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
          {!isMobile && (
            <div>
              <Filters
                {...{
                  queryPrice,
                  minPrice,
                  maxPrice,
                  characteristics
                }}
                filterEventName={CHANGE_FILTERS_EVENT_NAME}
              />
            </div>
          )}
          <div className="flex flex-col items-center flex-1">
            <div className="grid grid-cols-1 self-center gap-10 sm:grid-cols-2">
              {catalog.map(i => (
                <Card
                  key={i.id}
                  rating={i.rating}
                  price={i.price}
                  name={i.name}
                  photo={i.photo}
                  id={i.id}
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
  const firebase = new Firebase();
  const { id, min, max, page } = context.query;
  const actualPage = validatePage(page);
  const { skip, limit } = getSkipAndLimitValues(page);

  if (!id) return REDIRECT_CONFIG;

  const searchConfig: QueryObject = {
    field: "subcategory",
    condition: "==",
    value: id
  };

  const allProducts = await firebase.getDocumentsByQuery<FirebaseProduct>(
    "products",
    [searchConfig]
  );

  if (allProducts.length === 0) return REDIRECT_CONFIG;

  allProducts.sort((a, b) => a.price - b.price);
  const minPrice = allProducts[0].price;
  const maxPrice = allProducts[allProducts.length - 1].price;

  const { items, amountOfItems } = await fetchCatalog(
    context.query,
    minPrice,
    maxPrice,
    allProducts,
    skip,
    limit
  );

  const characteristics = await firebase.getDocumentsByQuery<Characteristic>(
    "characteristics",
    [searchConfig]
  );

  return {
    props: {
      products: items ? items : [],
      characteristics,
      allProducts,
      minPrice,
      maxPrice,
      queryPrice: {
        min: Number(min ?? minPrice),
        max: Number(max ?? maxPrice)
      },
      page: actualPage,
      totalQuantitiyOfPages: getAmountOfPages(amountOfItems)
    }
  };
};

export default CatalogPage;
