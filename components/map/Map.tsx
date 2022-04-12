import { FC } from "react";

import { MapProps } from "types/shop-map";

import ShopMap from "./ShopMap";

const Map: FC<MapProps> = ({ cities }) => {
  if (cities.length === 0) {
    console.warn("No city was loaded");
    return (
      <div className="w-full bg-grey-500 text-white text-xl h-86 flex items-center justify-center text-center px-2 lg:h-130">
        Возникла проблема при загрузке карты
      </div>
    );
  }

  return <ShopMap cities={cities} />;
};

export default Map;
