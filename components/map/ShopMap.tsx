import { FC, useState, FormEventHandler, useReducer, Reducer } from "react";
import GMap from "./GMap";
import styles from "styles/map.module.css";

interface SearchInfo {
  chosenCityId: City["id"];
  searchResults: City[];
}

type ChosenCityId = { type: "change-current-city"; payload: City["id"] };
type CitySearchResults = {
  type: "change-city-search-results";
  payload: City[];
};

type MenuAction = CitySearchResults | ChosenCityId;

type MapSearchReducer = Reducer<SearchInfo, MenuAction>;

const mapInfoReducer: MapSearchReducer = (state, action) => {
  switch (action.type) {
    case "change-current-city":
      return { ...state, chosenCityId: action.payload };
    case "change-city-search-results":
      return { ...state, searchResults: action.payload };
    default:
      throw new Error("Unexpected menu state behavior: " + process.cwd);
  }
};

const ShopMap: FC<{ geoInfo: GeoInfo }> = ({ geoInfo }) => {
  const INITIAL_MAP_INFO = {
    chosenCityId: geoInfo.cities[0].id,
    searchResults: geoInfo.cities
  };

  const [searchInfo, searchInfoDispatch] = useReducer<MapSearchReducer>(
    mapInfoReducer,
    INITIAL_MAP_INFO
  );
  const [showShops, setShowShops] = useState(false);

  const { searchResults, chosenCityId } = searchInfo;
  const resultShops = geoInfo.shops.filter(i => i.city === chosenCityId);
  const shopListStyle = showShops ? "flex" : "hidden";

  const toggleShopList = () => {
    setShowShops(!showShops);
  };

  const searchCity: FormEventHandler<HTMLInputElement> = event => {
    const { value } = event.target as HTMLInputElement;
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
  };

  const chooseCity = (cityId: City["id"]) => {
    return () => {
      searchInfoDispatch({ type: "change-current-city", payload: cityId });
    };
  };

  return (
    <div className="relative">
      <div className={styles["top-map-pannel"]}>
        <div className={styles["city-result"]}>
          <input
            type="text"
            placeholder="Город"
            className={styles["map-search-input"]}
            onInput={searchCity}
          />
          <div className="space-y-2 px-2 py-2 w-full overflow-y-auto border border-grey-400">
            {searchResults.map(i => (
              <button
                key={i.id}
                className="font-light text-sm w-full text-left"
                onClick={chooseCity(i.id)}
              >
                {i.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <GMap />
      <div
        className={
          "absolute bg-white w-full h-full top-0 left-0 z-30 flex-col items-start " +
          shopListStyle
        }
      >
        {resultShops.map(i => (
          <button key={i.id}>{i.name}</button>
        ))}
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
