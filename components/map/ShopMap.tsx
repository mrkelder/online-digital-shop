import { FC, useState } from "react";
import GMap from "./GMap";
import styles from "styles/map.module.css";

const ShopMap: FC<{ geoInfo: GeoInfo }> = ({ geoInfo }) => {
  const [showShops, setShowShops] = useState(false);
  const shopListStyle = showShops ? "flex" : "hidden";

  const toggleShopList = () => {
    setShowShops(!showShops);
  };

  return (
    <div className="relative">
      <div className={styles["top-map-pannel"]}>
        <div className={styles["city-result"]}>
          <input
            type="text"
            placeholder="Город"
            className={styles["map-search-input"]}
          />
          <div className="space-y-2 px-2 py-2 w-full overflow-y-auto border border-grey-400">
            {geoInfo.cities.map(i => (
              <button
                key={i.id}
                className="font-light text-sm w-full text-left"
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
        {geoInfo.shops.map(i => (
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
