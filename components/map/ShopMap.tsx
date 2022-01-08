import { FC, useState, FormEventHandler } from "react";
import GMap from "./GMap";
import styles from "styles/map.module.css";

interface SearchInfo {
  chosenCityId: City["id"];
  searchResults: City[];
}

const ShopMap: FC<{ geoInfo: GeoInfo }> = ({ geoInfo }) => {
  const [showShops, setShowShops] = useState(false);
  // FIXME: replace useState with useReducer
  const [searchInfo, setSearchInfo] = useState<SearchInfo>({
    chosenCityId: geoInfo.cities[0].id,
    searchResults: geoInfo.cities
  });

  const { searchResults, chosenCityId } = searchInfo;
  const resultShops = geoInfo.shops.filter(i => i.city === chosenCityId);
  const shopListStyle = showShops ? "flex" : "hidden";

  const toggleShopList = () => {
    setShowShops(!showShops);
  };

  const handleSearch: FormEventHandler<HTMLInputElement> = event => {
    const { value } = event.target as HTMLInputElement;
    const regEx = new RegExp("^" + value, "i");
    const resultCities = geoInfo.cities.filter(i => i.name.match(regEx));

    resultCities.length > 0
      ? setSearchInfo({ ...searchInfo, searchResults: resultCities })
      : setSearchInfo({ ...searchInfo, searchResults: geoInfo.cities });
  };

  const chooseCity = (cityId: City["id"]) => {
    return () => {
      setSearchInfo({ ...searchInfo, chosenCityId: cityId });
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
            onInput={handleSearch}
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
