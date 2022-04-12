import { GetServerSideProps, NextPage } from "next";

import Map from "components/map/Map";
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
    <Map cities={cities} />
  </div>
);

export const getServerSideProps: GetServerSideProps = async () => {
  const citiesFetch = await fetch(
    (process.env.NEXT_PUBLIC_HOSTNAME as string) + "/api/getCity"
  );

  const cities = await citiesFetch.json();

  return { props: { cities } };
};

export default ShopsPage;
