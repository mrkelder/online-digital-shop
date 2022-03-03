import { GetStaticProps, NextPage } from "next";

import ShopMap from "components/map/ShopMap";
import MetaHead from "components/meta/MetaHead";
import serializeShop from "utils/dto/serializeShop";
import Firebase from "utils/firebase";

interface Props {
  geoInfo: GeoInfo;
}

const TITLE = "Магазины";

const ShopsPage: NextPage<Props> = ({ geoInfo }) => (
  <div className="lg:max-w-full lg:mx-auto lg:px-12">
    <MetaHead
      title={TITLE}
      keywords="Карта магазинов, местоположение магазинов, магазины New London"
      description="Наши магазины расположены по всей территории Украины и способны осуществлять доставку"
    />

    <h1>{TITLE}</h1>
    <ShopMap {...{ geoInfo }} />
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const firebase = new Firebase();
  const shops = await firebase.getAllDocumentsInCollection<FirebaseShop>(
    "shops"
  );
  const cities = await firebase.getAllDocumentsInCollection<City>("cities");

  const geoInfo: GeoInfo = {
    shops: shops.map(shop => serializeShop(shop)),
    cities
  };

  return { props: { geoInfo }, revalidate: 10 };
};

export default ShopsPage;
