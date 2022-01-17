import Button from "components/Button";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Firebase from "utils/firebase";
import DefaultPhoto from "public/img/default-photo.jpg";
import Picture from "components/Picture";
import activeStarIcon from "public/img/star-active.png";
import starIcon from "public/img/star.png";
import SectionWrapper from "components/product-page/SectionWrapper";
import Characteristics from "components/product-page/Characteristics";
import styles from "styles/item-page.module.css";
import serializableShopDTO from "utils/dto/serializableShopDTO";
import LocationIcon from "public/img/geo-point.svg";
import Link from "next/link";
import ArrowIcon from "public/img/arrow.svg";
import Head from "next/head";

interface Props {
  itemObj: Product;
}

// FIXME: make it shceme.org friendly (https://schema.org/price)

function createStars(starIcon: StaticImageData, quantity: number) {
  return new Array(quantity).fill(0).map((_, index) => (
    <div className="relative w-4 h-4" key={`astar-${index}`}>
      <Image src={starIcon} alt="Положительная оценка" layout="fill" />
    </div>
  ));
}

const ProductPage: NextPage<Props> = ({ itemObj }) => {
  const MAXIMUM_RATING = 5;
  const activeStars = createStars(activeStarIcon, itemObj.rating);
  const inactiveStars = createStars(starIcon, MAXIMUM_RATING - itemObj.rating);

  const resolveDaySchedule = (schedule: Shop["schedule"]) => {
    // FIXME: extract to utils
    // FIXME: moment.js
    const date = new Date();
    const timetable = schedule[date.getDay()];
    if (timetable) return `Сегодня с ${timetable.from} по ${timetable.to}`;
    else return "Сегодня ваходной";
  };

  return (
    <div>
      <Head>
        <title>{itemObj.name}</title>
      </Head>

      <Link
        href={{
          pathname: "/subcategory",
          query: { id: itemObj.subcategory }
        }}
      >
        <a className="mx-3.5 mt-1 flex items-center text-grey-400 text-sm">
          {" "}
          <span className="w-1 inline-block mr-1">
            <ArrowIcon />
          </span>{" "}
          На страницу подкатегорий
        </a>
      </Link>
      <h1 className="text-xl font-bold text-grey-400 my-1 mx-3.5">
        {itemObj.name}
      </h1>
      <div className="flex mb-2 mx-3.5">
        {activeStars}
        {inactiveStars}
      </div>
      <div className="bg-white p-2.5 mb-2 border border-grey-100 w-72 mx-3.5">
        <div className="relative h-64">
          {itemObj.photo ? (
            <Picture
              image1x={itemObj.photo.image1x}
              image2x={itemObj.photo.image2x}
              alt="Фото товара"
            />
          ) : (
            <Image
              layout="fill"
              src={DefaultPhoto}
              alt="Фото товара"
              objectFit="cover"
              objectPosition="50%"
            />
          )}
        </div>
      </div>
      <p className="text-red text-2xl mb-1 text-light mx-3.5">
        {itemObj.price} грн
      </p>
      <div className="mx-3.5">
        <Button variant="lg">Купить</Button>
      </div>
      <h2 className="text-base font-regular mt-2 text-grey-650 mx-3.5">
        Ключевые особенности
      </h2>
      <table className={styles["table"]}>
        <tbody>
          {itemObj.key_characteristics.map(c => (
            <tr key={c.id}>
              <th className={styles["th-name"]}>{c.name}</th>
              <th className={styles["th-value"]}>{c.value}</th>
            </tr>
          ))}
        </tbody>
      </table>
      <a
        href="#all-characteristics"
        className="text-sm underline font-regular mt-2 mb-10 text-grey-650 mx-3.5"
      >
        Показать все характеристики
      </a>
      <div className="my-3 mx-3.5">
        <h2 className="text-grey-400 text-lg mb-1">
          Доступные магазины{" "}
          <span className="inline-block w-2.5">
            <LocationIcon />
          </span>
        </h2>
        {itemObj.available_in.map(i => (
          <div key={i.id} className="flex flex-col mb-2">
            <b className="text-grey-650 text-xs mb-0.5">{i.name}</b>
            <span className="text-xs text-grey-300 underline">
              {resolveDaySchedule(i.schedule)}
            </span>
          </div>
        ))}
      </div>
      <SectionWrapper text="Описание" position="first">
        <p className="text-base mx-3.5 my-2">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam vel
          consectetur animi voluptatum voluptatem enim aliquam error! Fugiat,
          eaque harum placeat incidunt aliquam mollitia soluta non porro error
          dolorum veniam!
        </p>
      </SectionWrapper>
      <span id="all-characteristics" />
      <SectionWrapper
        text="Характеристики"
        id="all-characteristics"
        openedByDefault
      >
        <Characteristics characteristics={itemObj.characteristics} />
      </SectionWrapper>
    </div>
  );
};

const firebase = new Firebase();

export const getStaticProps: GetStaticProps = async context => {
  const result = await firebase.getDocumentsById<FirebaseProduct>("products", [
    context.params?.id as string
  ]);

  if (result.length === 0)
    return {
      notFound: true
    };

  const characteristicsIds = result[0].characteristics.map(i => i.name);

  const characteristicsObj = await firebase.getDocumentsById<Characteristic>(
    "characteristics",
    characteristicsIds
  );

  function findCharacteristicNameById(id: string) {
    const result = characteristicsObj.find(i => i.id === id) as Characteristic;
    return result.name;
  }

  const available_in = (
    (await firebase.getDocumentsById<FirebaseShop>(
      "shops",
      result[0].available_in
    )) as FirebaseShop[]
  ).map(i => serializableShopDTO(i));

  const characteristics: Product["characteristics"] =
    result[0].characteristics.map(i => ({
      ...i,
      id: i.name,
      name: findCharacteristicNameById(i.name)
    }));

  const key_characteristics: Product["key_characteristics"] =
    result[0].key_characteristics.map(id =>
      characteristics.find(c => c.id === id)
    ) as ProductCharacteristic[];

  const itemObj: Product = {
    ...result[0],
    characteristics,
    key_characteristics,
    available_in
  };

  return {
    props: { itemObj },
    revalidate: 10
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await firebase.getAllDocumentsInCollection<Product>(
    "products"
  );

  const paths = products.map(i => ({ params: { id: i.id } }));

  return {
    paths,
    fallback: "blocking"
  };
};

export default ProductPage;
