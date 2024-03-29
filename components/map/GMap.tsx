import { FC, useCallback, useEffect, useRef } from "react";

import { Loader, LoaderOptions } from "@googlemaps/js-api-loader";

import useLanguage from "hooks/useLanguage";
import useMatchMedia from "hooks/useMatchMedia";
import { ShopWithIndexObject } from "types/shop-map";

interface Props {
  allShopsInCurrentCity: ShopWithIndexObject[];
  currentShop: ShopWithIndexObject;
}

interface GoogleMapMarker {
  marker: google.maps.Marker;
  listener: google.maps.MapsEventListener;
}

const GMap: FC<Props> = ({ allShopsInCurrentCity, currentShop }) => {
  const { langVariant } = useLanguage();
  const markersRef = useRef<Array<GoogleMapMarker>>([]);
  const mapRef = useRef<google.maps.Map | null>(null);
  const { isMobile, isLoaded } = useMatchMedia();
  const GOOGLE_ELEMENT_NAME = "google-map-el";

  const drawMarker = useCallback(
    (map: google.maps.Map, shopObj: ShopWithIndexObject) => {
      const [lat, lng] = shopObj.geo;
      const geoInfo = { lng, lat };

      const marker = new google.maps.Marker({
        position: geoInfo,
        map,
        title: langVariant(shopObj.name.ua, shopObj.name.ru)
      });
      const listener = marker.addListener("click", () => {
        mapRef.current?.panTo(geoInfo);
        const event = new CustomEvent("change-shop", {
          detail: shopObj.index
        });
        dispatchEvent(event);
      });
      markersRef.current.push({ marker, listener });
    },
    [langVariant]
  );

  useEffect(() => {
    async function createMap() {
      const [lat, lng] = currentShop.geo;

      if (!mapRef.current) {
        const options: LoaderOptions = {
          apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
          id: process.env.NEXT_PUBLIC_MAPS_ID as string
        };

        const loader = new Loader(options);
        const google = await loader.load();
        const map = new google.maps.Map(
          document.getElementById(GOOGLE_ELEMENT_NAME) as HTMLElement,
          {
            center: { lat, lng },
            zoom: 12,
            zoomControl: !isMobile,
            fullscreenControl: !isMobile
          }
        );
        mapRef.current = map;
      } else {
        mapRef.current.panTo({ lat, lng });
      }

      removeMarkers();
      drawMarker(mapRef.current, currentShop);

      for (const i of allShopsInCurrentCity) {
        drawMarker(mapRef.current, i);
      }
    }

    if (isLoaded) createMap();
  }, [currentShop, allShopsInCurrentCity, isLoaded, isMobile, drawMarker]);

  function removeMarkers() {
    markersRef.current.forEach(markerObj => {
      markerObj.marker.setMap(null);
      markerObj.listener.remove();
    });
    markersRef.current = [];
  }

  return (
    <div>
      <div id={GOOGLE_ELEMENT_NAME} className="w-full" />

      <style jsx>{`
        #${GOOGLE_ELEMENT_NAME} {
          height: 405px;
        }

        @media (min-width: 1024px) {
          #${GOOGLE_ELEMENT_NAME} {
            height: 550px;
          }
        }
      `}</style>
    </div>
  );
};

export default GMap;
