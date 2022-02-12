import Button from "components/Button";
import MobileDialog from "components/MobileDialog";
import MobileSlideMenu from "components/MobileSlideMenu";
import Card from "components/product-card/Card";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import Firebase from "utils/firebase";
import { useRouter } from "next/router";
import fetchCatalog from "utils/fetchCatalog";
import Filters from "components/catalog-page/Filters";

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

const TITLE = "Каталог";
const ITEMS_PER_PAGE = 10;
const FIRST_PAGE = 1;
const DEFAULT_PAGE = FIRST_PAGE;
const DEFAULT_SKIP = DEFAULT_PAGE - 1;
const DEFAULT_LIMIT = DEFAULT_PAGE * ITEMS_PER_PAGE;

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
  // FIXME: update paggination after applied filters ----------------------------------
  // TODO: when subcategory is not specefied
  // TODO: when there is no items

  const router = useRouter();
  const [areMobileFiltersOpened, setAreMobileFiltersOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [innerWidth, setInnerWidth] = useState(0);
  const [catalog, setCatalog] = useState<FirebaseProduct[]>(products);

  const toggleMobileFilters = useCallback(
    () => setAreMobileFiltersOpened(!areMobileFiltersOpened),
    [areMobileFiltersOpened]
  );

  const memoizedFilters = useCallback(
    () => (
      <Filters
        {...{
          queryPrice,
          minPrice,
          maxPrice,
          toggleMobileFilters,
          characteristics
        }}
      />
    ),
    [characteristics, maxPrice, minPrice, queryPrice, toggleMobileFilters]
  );

  useEffect(() => {
    function handleResize() {
      setInnerWidth(window.innerWidth);
    }

    handleResize();

    addEventListener("resize", handleResize);

    return () => {
      removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    async function handle() {
      const page = validatePage(router.query.page);
      const { skip, limit } = getSkipAndLimitValues(page);

      const items = await fetchCatalog(
        router.query,
        minPrice,
        maxPrice,
        allProducts,
        skip,
        limit
      );
      setCatalog(items);
    }
    handle();
  }, [router.query, maxPrice, minPrice, allProducts]);

  function buildPagination(
    currentpage: number,
    totalPages: number,
    maxPages: 5 | 7
  ) {
    // TODO: rename the names
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

  const paggination = buildPagination(
    currentPage,
    totalQuantitiyOfPages,
    innerWidth < 1024 ? 5 : 7
  );

  return (
    <div>
      <Head>
        <title>{TITLE}</title>
      </Head>

      <MobileDialog
        opened={areMobileFiltersOpened}
        onClose={toggleMobileFilters}
      >
        <MobileSlideMenu>{memoizedFilters}</MobileSlideMenu>
      </MobileDialog>

      <h1 className="text-center">{TITLE}</h1>
      <div className="flex flex-col ">
        <div className="mx-auto w-56 my-3">
          <Button onClick={toggleMobileFilters}>Фильтры</Button>
        </div>
        <div className="flex flex-col items-center">
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
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const firebase = new Firebase();
  const { id, min, max, page } = context.query;
  const actualPage = validatePage(page);
  const { skip, limit } = getSkipAndLimitValues(page);

  const searchConfig: QueryObject = {
    field: "subcategory",
    condition: "==",
    value: id
  };

  const allProducts = await firebase.getDocumentsByQuery<FirebaseProduct>(
    "products",
    [searchConfig]
  );

  allProducts.sort((a, b) => a.price - b.price);
  const minPrice = allProducts[0].price;
  const maxPrice = allProducts[allProducts.length - 1].price;

  const products = await fetchCatalog(
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
      products: products ? products : [],
      characteristics,
      allProducts,
      minPrice,
      maxPrice,
      queryPrice: {
        min: Number(min ?? minPrice),
        max: Number(max ?? maxPrice)
      },
      page: actualPage,
      totalQuantitiyOfPages: Math.ceil(allProducts.length / ITEMS_PER_PAGE)
    }
  };
};

export default CatalogPage;
