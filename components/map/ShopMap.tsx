import {
  FC,
  useState,
  FormEventHandler,
  useReducer,
  Reducer,
  useMemo,
  useCallback
} from "react";
import GMap from "./GMap";
import styles from "styles/map.module.css";
import Shop from "./Shop";

interface SearchInfo {
  chosenCityId: City["id"];
  chosenShop: Shop;
  searchResults: City[];
}

type ChosenCityId = { type: "change-city"; payload: City["id"] };
type ChosenShop = { type: "change-shop"; payload: Shop };
type CitySearchResults = {
  type: "change-city-search-results";
  payload: City[];
};

type MenuAction = CitySearchResults | ChosenCityId | ChosenShop;

type MapSearchReducer = Reducer<SearchInfo, MenuAction>;

const mapInfoReducer: MapSearchReducer = (state, action) => {
  switch (action.type) {
    case "change-city":
      return { ...state, chosenCityId: action.payload };
    case "change-shop":
      return { ...state, chosenShop: action.payload };
    case "change-city-search-results":
      return { ...state, searchResults: action.payload };
    default:
      throw new Error("Unexpected menu state behavior: " + process.cwd);
  }
};

const ShopMap: FC<{ geoInfo: GeoInfo }> = ({ geoInfo }) => {
  // TODO: add animation for shop list
  // TODO: when user clicks a marker we have to choose this point
  const INITIAL_MAP_INFO: SearchInfo = {
    chosenCityId: geoInfo.cities[0].id,
    chosenShop: geoInfo.shops.find(
      i => i.city === geoInfo.cities[0].id
    ) as Shop,
    searchResults: geoInfo.cities
  };

  const [searchInfo, searchInfoDispatch] = useReducer<MapSearchReducer>(
    mapInfoReducer,
    INITIAL_MAP_INFO
  );
  const [showShops, setShowShops] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { searchResults, chosenCityId } = searchInfo;
  const resultShops = geoInfo.shops.filter(i => i.city === chosenCityId);
  const shopListStyle = showShops ? "flex" : "hidden";

  const memoizedGMap = useMemo(
    () => (
      <GMap
        currentShop={searchInfo.chosenShop}
        allShopsInCurrentCity={geoInfo.shops.filter(
          i => i.city === searchInfo.chosenCityId
        )}
      />
    ),
    [searchInfo.chosenShop, searchInfo.chosenCityId, geoInfo.shops]
  );

  const toggleShopList = () => {
    setShowShops(!showShops);
  };

  function selectCityAccordingToValue(value: string) {
    try {
      const regEx = new RegExp("^" + value, "i");
      const resultCities = geoInfo.cities.filter(i => i.name.match(regEx));

      resultCities.length > 0
        ? searchInfoDispatch({
            type: "change-city-search-results",
            payload: resultCities
          })
        : searchInfoDispatch({
            type: "change-city-search-results",
            payload: geoInfo.cities
          });
    } catch {
      searchInfoDispatch({
        type: "change-city-search-results",
        payload: geoInfo.cities
      });
    }
  }

  const searchCity: FormEventHandler<HTMLInputElement> = event => {
    const { value } = event.target as HTMLInputElement;
    setSearchValue(value);
    selectCityAccordingToValue(value);
  };

  const submitSerach: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    selectCityAccordingToValue(searchValue);
  };

  const chooseShop = useCallback(
    (shopObj: Shop) => {
      return () => {
        if (shopObj.id !== searchInfo.chosenShop.id) {
          searchInfoDispatch({ type: "change-shop", payload: shopObj });
        }
      };
    },
    [searchInfo.chosenShop.id]
  );

  function changeCity(cityId: City["id"]) {
    return () => {
      if (cityId !== searchInfo.chosenCityId) {
        searchInfoDispatch({ type: "change-city", payload: cityId });
        chooseShop(geoInfo.shops.find(i => i.city === cityId) as Shop)();
      }
    };
  }

  const shopList = resultShops.map(i => (
    <Shop
      key={i.id}
      shopObj={i}
      onClick={chooseShop(i)}
      isSelected={i.id === searchInfo.chosenShop.id}
    />
  ));

  const cityList = searchResults.map(i => (
    <button
      key={i.id}
      className="font-light text-sm w-full text-left"
      onClick={changeCity(i.id)}
    >
      {i.name}
    </button>
  ));

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
            />
            <div className={styles["city-list"]}>{cityList}</div>
          </form>
          <div className="overflow-y-auto h-full">{shopList}</div>
        </div>
        <div className="flex-1">{memoizedGMap}</div>
      </div>
      <div
        className={
          "absolute bg-white w-full h-full top-0 left-0 z-30 flex-col items-start overflow-y-auto py-4 lg:hidden " +
          shopListStyle
        }
      >
        {shopList}
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
