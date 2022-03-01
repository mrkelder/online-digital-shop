import { FC, useEffect, useRef } from "react";
import { Loader, LoaderOptions } from "@googlemaps/js-api-loader";
import useMatchMedia from "hooks/useMatchMedia";

interface Props {
  allShopsInCurrentCity: Shop[];
  currentShop: Shop;
}

const GMap: FC<Props> = ({ allShopsInCurrentCity, currentShop }) => {
  const markersRef = useRef<
    Array<{
      marker: google.maps.Marker;
      listener: google.maps.MapsEventListener;
    }>
  >([]);
  const mapRef = useRef<google.maps.Map | null>(null);
  const { isMobile, isLoaded } = useMatchMedia();
  const GOOGLE_ELEMENT_NAME = "google-map-el";

  useEffect(() => {
    async function createMap() {
      const { lng, lat } = currentShop.geo;

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
  }, [currentShop, allShopsInCurrentCity, isLoaded, isMobile]);

  function removeMarkers() {
    markersRef.current.forEach(markerObj => {
      markerObj.marker.setMap(null);
      markerObj.listener.remove();
    });
    markersRef.current = [];
  }

  function drawMarker(map: google.maps.Map, shopObj: Shop) {
    const marker = new google.maps.Marker({
      position: shopObj.geo,
      map,
      title: shopObj.name
    });
    const listener = marker.addListener("click", () => {
      mapRef.current?.panTo(shopObj.geo);
      const event = new CustomEvent("change-shop", { detail: shopObj });
      dispatchEvent(event);
    });
    markersRef.current.push({ marker, listener });
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
