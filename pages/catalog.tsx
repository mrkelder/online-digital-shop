import Button from "components/Button";
import MobileDialog from "components/MobileDialog";
import MobileSlideMenu from "components/MobileSlideMenu";
import Card from "components/product-card/Card";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useRef,
  useState
} from "react";
import Firebase from "utils/firebase";
import CrossIcon from "public/img/cross.svg";
import ContentWrapper from "components/ContentWrapper";
import { useRouter } from "next/router";
import ReactSlider from "react-slider";
import Input from "components/Input";
import type { CharacteristicQuery } from "utils/fetchCatalog";
import fetchCatalog from "utils/fetchCatalog";

interface Props {
  products: FirebaseProduct[];
  allProducts: FirebaseProduct[];
  characteristics: Characteristic[];
  minPrice: number;
  maxPrice: number;
  queryPrice: { min: number; max: number };
}

type PriceFilterField = "min" | "max";

const TITLE = "Каталог";

const CatalogPage: NextPage<Props> = ({
  products,
  characteristics,
  allProducts,
  minPrice,
  maxPrice,
  queryPrice
}) => {
  // TODO: when subcategory is not specefied
  // TODO: when there is no items

  const router = useRouter();
  const characteristicsQuery = useRef<Set<string>>(new Set());

  const [catalog, setCatalog] = useState<FirebaseProduct[]>(products);
  const [areMobileFiltersOpened, setAreMobileFiltersOpened] = useState(false);
  const [priceFilter, setPriceFilter] = useState({
    min: queryPrice.min,
    max: queryPrice.max
  });

  useEffect(() => {
    async function handle() {
      const items = await fetchCatalog(
        router.query,
        minPrice,
        maxPrice,
        allProducts
      );
      setCatalog(items);
    }
    handle();
  }, [router.query, maxPrice, minPrice, allProducts]);

  function submitCharacteristics() {
    const { route, query } = router;
    const { min, max } = priceFilter;
    const set = characteristicsQuery.current;

    const values: ReadonlyArray<CharacteristicQuery> = Array.from(set).map(i =>
      JSON.parse(i)
    );

    delete query.max;
    delete query.min;

    router.push(
      {
        href: route,
        query: {
          ...query,
          ...(minPrice !== min && { min }),
          ...(maxPrice !== max && { max }),
          c: values.map(i => `${i.id}.${i.valueIndex}`)
        }
      },
      undefined,
      {
        shallow: true
      }
    );
  }

  function priceInputHanlder(field: PriceFilterField) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      changePriceValue(Number(e.target.value), field);
    };
  }

  function rangeHandler(values: [number, number]) {
    const [min, max] = values;
    if (min !== priceFilter.min) changePriceValue(min, "min");
    if (max !== priceFilter.max) changePriceValue(max, "max");
  }

  // TODO: rename the below
  function changePriceValue(value: number, field: PriceFilterField) {
    switch (field) {
      case "min": {
        if (value >= minPrice && value < priceFilter.max)
          changePriceFilter(value, "min");
        return;
      }

      case "max": {
        if (value <= maxPrice && value > priceFilter.min)
          changePriceFilter(value, "max");
        return;
      }

      default:
        console.error("Wrong field attribute");
        return;
    }
  }

  const changePriceFilter = (value: number, field: PriceFilterField) => {
    const newState = JSON.parse(JSON.stringify(priceFilter));
    newState[field] = Math.max(Math.min(value, maxPrice), minPrice);
    setPriceFilter(newState);
  };

  const applyCharacteristic: ChangeEventHandler<HTMLInputElement> = e => {
    const { checked, value } = e.target;
    if (checked) characteristicsQuery.current.add(value);
    else characteristicsQuery.current.delete(value);
  };

  const toggleMobileFilters = () =>
    setAreMobileFiltersOpened(!areMobileFiltersOpened);
  return (
    <div>
      <Head>
        <title>{TITLE}</title>
      </Head>

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
          <div className="px-3.5 py-2">
            <p>Цена</p>
            <ReactSlider
              min={minPrice}
              max={maxPrice}
              className="bg-grey-200 rounded-full h-2 flex items-center my-2"
              value={[priceFilter.min, priceFilter.max]}
              renderThumb={props => (
                <div
                  {...props}
                  className="w-5 h-5 bg-grey-100 rounded-full box-shadow"
                />
              )}
              onChange={rangeHandler}
              pearling
              minDistance={10}
            />
            <div className="flex justify-between">
              <div className="w-12">
                <Input
                  underline
                  placeholder="Цена"
                  value={priceFilter.min}
                  type="number"
                  onChange={priceInputHanlder("min")}
                />
              </div>
              <div className="w-12">
                <Input
                  underline
                  placeholder="Цена"
                  value={priceFilter.max}
                  type="number"
                  onChange={priceInputHanlder("max")}
                />
              </div>
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {characteristics.map(c => (
              <ContentWrapper text={c.name} key={c.id}>
                <ul className="px-3.5 my-1">
                  {c.values.map((v, index) => (
                    <li key={v + c.id}>
                      <input
                        className="mr-1"
                        onChange={applyCharacteristic}
                        id={c.id + index}
                        type="checkbox"
                        name={c.id}
                        value={JSON.stringify({ id: c.id, valueIndex: index })}
                      />
                      <label htmlFor={c.id + index}>{v}</label>
                    </li>
                  ))}
                </ul>
              </ContentWrapper>
            ))}
          </div>
          <Button variant="lg" onClick={submitCharacteristics}>
            Подтвердить
          </Button>
        </MobileSlideMenu>
      </MobileDialog>

      <h1 className="text-center">{TITLE}</h1>
      <div className="flex flex-col">
        <div className="mx-auto w-56 my-3">
          <Button onClick={toggleMobileFilters}>Фильтры</Button>
        </div>
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
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const firebase = new Firebase();
  const { id } = context.query;

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
    allProducts
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
        min: Number(context.query.min ?? minPrice),
        max: Number(context.query.max ?? maxPrice)
      }
    }
  };
};

export default CatalogPage;
