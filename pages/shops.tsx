import { GetStaticProps, NextPage } from "next";

import ShopMap from "components/map/ShopMap";
import MetaHead from "components/meta/MetaHead";

interface Props {
  cities: City[];
}

const TITLE = "Магазины";

const ShopsPage: NextPage<Props> = ({ cities }) => (
  <div className="lg:max-w-full lg:mx-auto lg:px-12">
    <MetaHead
      title={TITLE}
      keywords="Карта магазинов, местоположение магазинов, магазины New London"
      description="Наши магазины расположены по всей территории Украины и способны осуществлять доставку"
    />

    <h1>{TITLE}</h1>
    <ShopMap cities={cities} />
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const citiesFetch = await fetch(
    (process.env.NEXT_PUBLIC_HOSTNAME as string) + "/api/getCity"
  );

  const cities = await citiesFetch.json();

  return { props: { cities }, revalidate: 10 };
};

export default ShopsPage;
