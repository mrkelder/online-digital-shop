import { FC, useEffect, useRef } from "react";
import { Loader, LoaderOptions } from "@googlemaps/js-api-loader";

const GMap: FC = () => {
  const mapRef = useRef<google.maps.Map>();
  const GOOGLE_ELEMENT_NAME = "google-map-el";

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;

    async function createMap() {
      const options: LoaderOptions = {
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        id: process.env.NEXT_PUBLIC_MAPS_ID as string
      };

      const loader = new Loader(options);
      const google = await loader.load();
      const map = new google.maps.Map(
        document.getElementById(GOOGLE_ELEMENT_NAME) as HTMLElement,
        {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
          zoomControl: !isMobile,
          fullscreenControl: !isMobile
        }
      );

      mapRef.current = map;
    }

    createMap();
  }, []);

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
