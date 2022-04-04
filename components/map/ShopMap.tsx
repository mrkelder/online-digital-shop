import {
  FC,
  useState,
  FormEventHandler,
  useMemo,
  useCallback,
  useEffect
} from "react";

import useMatchMedia from "hooks/useMatchMedia";
import styles from "styles/map.module.css";
import {
  ChangeShopEvent,
  CitySearchResult,
  ShopWithIndexObject
} from "types/shop-map";

import GMap from "./GMap";
import Shop from "./Shop";

interface Props {
  cities: City[];
}

const citiesToCitySearchResults = (cities: City[]): CitySearchResult[] =>
  cities.map((i, index) => ({ ...i, index }));

const shopWithIndexObject = (shops: Shop[]): ShopWithIndexObject[] =>
  shops.map((i, index) => ({ ...i, index }));

const ShopMap: FC<Props> = ({ cities }) => {
  // TODO: add animation for shop list
  const defaultCitySearchList = useMemo(
    () => citiesToCitySearchResults(cities),
    [cities]
  );

  const [chosenCityIndex, setChosenCityIndex] = useState(0);
  const [chosenShopIndex, setChosenShopIndex] = useState(0);
  const [citySearchResults, setCitySearchResults] = useState(
    defaultCitySearchList
  );
  const [showShops, setShowShops] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { isMobile, isLoaded } = useMatchMedia();
  const shopListStyle = showShops ? "flex" : "hidden";
  const shouldDisplayMobileShops = isMobile !== null && isMobile && isLoaded;

  const currentCity: City = useMemo(
    () => cities[chosenCityIndex],
    [cities, chosenCityIndex]
  );

  const currentShop: ShopWithIndexObject = useMemo(
    () => ({ ...currentCity.shops[chosenShopIndex], index: chosenShopIndex }),
    [chosenShopIndex, currentCity.shops]
  );

  const memoizedGMap = useMemo(
    () => (
      <GMap
        currentShop={currentShop}
        allShopsInCurrentCity={shopWithIndexObject(currentCity.shops)}
      />
    ),
    [currentCity.shops, currentShop]
  );

  const toggleShopList = () => {
    setShowShops(!showShops);
  };

  function findMatchingCities(value: string): CitySearchResult[] {
    try {
      const regEx = new RegExp("^" + value.trim(), "i");
      const resultCities = defaultCitySearchList.filter(i =>
        i.name.match(regEx)
      );
      return resultCities;
    } catch {
      return defaultCitySearchList;
    }
  }

  const searchCity: FormEventHandler<HTMLInputElement> = event => {
    const { value } = event.target as HTMLInputElement;
    setSearchValue(value);
    const resultCities = findMatchingCities(value);
    setCitySearchResults(resultCities);
  };

  const submitSerach: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const resultCities = findMatchingCities(searchValue);
    if (resultCities.length !== 0) setChosenCityIndex(resultCities[0].index);
    setChosenShopIndex(0);
  };

  const changeShop = useCallback((shopIndex: number) => {
    return () => {
      setChosenShopIndex(shopIndex);
    };
  }, []);

  const changeCity = useCallback((cityIndex: number) => {
    return () => {
      setChosenShopIndex(0);
      setChosenCityIndex(cityIndex);
    };
  }, []);

  useEffect(() => {
    function handler(event: ChangeShopEvent) {
      setChosenShopIndex(event.detail);
    }

    const SHOP_LIST_EVENT_NAME = "change-shop";

    addEventListener(SHOP_LIST_EVENT_NAME, handler as EventListener);

    return () => {
      removeEventListener(SHOP_LIST_EVENT_NAME, handler as EventListener);
    };
  }, []);

  const cityList = useMemo(
    () =>
      citySearchResults.length !== 0 ? (
        citySearchResults.map((i, index) => (
          <button
            key={`city_${index}`}
            className="font-light text-sm w-full text-left"
            onClick={changeCity(i.index)}
            type="button"
          >
            {i.name}
          </button>
        ))
      ) : (
        <p className="font-light text-sm w-full text-left">Результатов нет</p>
      ),
    [changeCity, citySearchResults]
  );

  const shopList = useMemo(
    () =>
      currentCity.shops.map((i, index) => (
        <Shop
          key={`shop_${index}`}
          shopObj={i}
          onClick={changeShop(index)}
          isSelected={index === chosenShopIndex}
        />
      )),
    [changeShop, chosenShopIndex, currentCity.shops]
  );

  return (
    <div className="relative">
      <div className={styles["top-map-pannel"]}>
        <form onSubmit={submitSerach} className={styles["city-result"]}>
          <input
            type="text"
            placeholder="Город"
            className={styles["map-search-input"]}
            onInput={searchCity}
            value={searchValue}
            name="city"
            autoComplete="off"
          />
          <div className={styles["city-list"]}>{cityList}</div>
        </form>
      </div>
      <div className="flex lg:shadow-lg bg-white">
        {/* Desktop side bar */}
        <div className="hidden flex-col p-4 w-96 lg:flex">
          <form onSubmit={submitSerach} className={styles["city-result"]}>
            <input
              type="text"
              placeholder="Город"
              className={styles["map-search-input"]}
              onInput={searchCity}
              value={searchValue}
              name="city"
              autoComplete="off"
            />
            <div className={styles["city-list"]}>{cityList}</div>
          </form>
          {!shouldDisplayMobileShops && (
            <div className="overflow-y-auto h-full">{shopList}</div>
          )}
        </div>
        <div className="flex-1">{memoizedGMap}</div>
      </div>
      <div
        className={
          "absolute bg-white w-full h-full top-0 left-0 z-30 flex-col items-start overflow-y-auto py-4 lg:hidden " +
          shopListStyle
        }
      >
        {shouldDisplayMobileShops && shopList}
      </div>
      <div className={styles["bottom-map-pannel"]}>
        <button
          className="w-full bg-white text-left px-2 border border-grey-400 text-grey-500 font-light h-10"
          onClick={toggleShopList}
        >
          Показать все магазины
        </button>
      </div>
    </div>
  );
};

export default ShopMap;
