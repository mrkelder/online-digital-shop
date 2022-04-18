import { GetServerSideProps, NextPage } from "next";

import Map from "components/map/Map";
import MetaHead from "components/meta/MetaHead";
import useLanguage from "hooks/useLanguage";

interface Props {
  cities: City[];
}

const ShopsPage: NextPage<Props> = ({ cities }) => {
  const { langVariant } = useLanguage();
  const title = langVariant("Магазини", "Магазины");

  return (
    <div className="lg:max-w-full lg:mx-auto lg:px-12">
      <MetaHead
        title={title}
        keywords={langVariant(
          "Карта магазинів, розташування магазинів, магазини New London",
          "Карта магазинов, местоположение магазинов, магазины New London"
        )}
        description={langVariant(
          "Наші магазини розташовані по всій території України та здатні здійснювати доставку",
          "Наши магазины расположены по всей территории Украины и способны осуществлять доставку"
        )}
      />

      <h1>{title}</h1>
      <Map cities={cities} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const citiesFetch = await fetch(
    (process.env.NEXT_PUBLIC_HOSTNAME as string) + "/api/getCity"
  );

  const cities = await citiesFetch.json();

  return { props: { cities } };
};

export default ShopsPage;
