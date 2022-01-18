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
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, SwiperOptions } from "swiper";
import { useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";

interface Props {
  itemObj: Product;
}

// FIXME: make it shceme.org friendly (https://schema.org/price)

const swiperConf: SwiperOptions = {
  modules: [FreeMode],
  freeMode: true,
  slidesPerView: 2.4,
  breakpoints: {
    320: {
      slidesPerView: 1.2
    },
    400: {
      slidesPerView: 1.8
    },
    560: {
      slidesPerView: 2.2
    },
    728: {
      slidesPerView: 2.8
    },
    1024: {
      slidesPerView: 3
    }
  }
};

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
  const [chosenPhotoIndex, setChosenPhotoIndex] = useState(0);

  // FIXME: render conditionally
  // TODO: add side buttons for photo selector
  // TODO: prefetch all photos to prevent lagging while swithcing between photos

  const choosePhotoIndex = (index: number) => {
    return () => {
      setChosenPhotoIndex(index);
    };
  };

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
        <a className="mx-3.5 mt-1 flex items-center text-grey-400 text-sm lg:mx-0">
          {" "}
          <span className="w-1 inline-block mr-1">
            <ArrowIcon />
          </span>{" "}
          На страницу подкатегорий
        </a>
      </Link>
      <h1 className="text-xl font-bold text-grey-400 my-1 mx-3.5 lg:mx-0">
        {itemObj.name}
      </h1>
      <div className="flex mb-2 mx-3.5 lg:mx-0">
        {activeStars}
        {inactiveStars}
      </div>
      <div className="flex flex-col lg:flex-row lg:space-x-5">
        <div className="lg:bg-white box-border lg:flex-1 lg:p-4 lg:shadow-xl lg:flex lg:flex-col lg:items-center">
          <div className="hidden relative w-full h-96 mb-2 lg:block">
            <Image
              src={itemObj.photos[chosenPhotoIndex].image2x as string}
              layout="fill"
              alt="Фото товара"
              objectFit="contain"
              objectPosition="50%"
            />
          </div>
          <div className="mb-2 w-full px-3.5 overflow-hidden lg:w-1/2">
            <Swiper {...swiperConf}>
              {itemObj.photos.map((photo, index) => (
                <SwiperSlide
                  key={`slide_${index}`}
                  onClick={choosePhotoIndex(index)}
                >
                  <div className={styles["photo-slide"]}>
                    {photo ? (
                      <Picture
                        image1x={photo.image1x}
                        image2x={photo.image2x}
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
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="box-border lg:flex-1 lg:bg-white lg:shadow-xl lg:p-4">
          <p className="text-red text-2xl mb-1 text-light mx-3.5 lg:text-grey-500 lg:mx-0 lg:text-3xl lg:mb-2.5">
            {itemObj.price} грн
          </p>
          <div className="mx-3.5 lg:hidden">
            <Button variant="lg" disabled={!itemObj.available}>
              Купить
            </Button>
          </div>
          <div className="hidden lg:block w-48">
            <Button variant="sm" disabled={!itemObj.available}>
              Купить
            </Button>
          </div>
          <b
            className={
              itemObj.available
                ? "hidden"
                : "inline" + " mx-3.5 mt-1 text-grey-300 lg:mx-0"
            }
          >
            Нет в наличии
          </b>
          <hr className="hidden mt-2 lg:block" />
          <h2 className="text-base font-regular mt-2 text-grey-650 mx-3.5 lg:text-lg">
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
          <hr className="hidden mb-2 lg:block" />
          <a
            href="#all-characteristics"
            className="text-sm underline font-regular mt-2 mb-10 text-grey-650 mx-3.5 lg:hidden"
          >
            Показать все характеристики
          </a>
          <div className="my-3 mx-3.5 lg:my-1">
            <h2 className="text-grey-650 font-regular text-lg mb-1 flex items-center lg:text-lg lg:mb-2">
              Доступные магазины{" "}
              <span className="inline-block w-2.5 ml-1 text-red">
                <LocationIcon />
              </span>
            </h2>
            {itemObj.available_in.map(i => (
              <div key={i.id} className="flex flex-col mb-2 lg:mb-3">
                <address className="text-grey-650 text-xs mb-0.5">
                  {i.name}
                </address>
                <span className="text-xs text-grey-300 underline">
                  {resolveDaySchedule(i.schedule)}
                </span>
              </div>
            ))}
          </div>
          <div className="lg:hidden">
            <SectionWrapper text="Описание" position="first">
              <p className="text-base mx-3.5 my-2 text-grey-600">
                {itemObj.description}
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
        </div>
      </div>
      <div className="hidden bg-white mt-10 p-4 mb-2 lg:block">
        <h2>Описание</h2>
        <p className="text-base text-grey-600 mt-1">{itemObj.description}</p>
      </div>
      <div className="hidden bg-white p-4 mb-2 lg:block">
        <h2>Характеристики</h2>
        <Characteristics characteristics={itemObj.characteristics} />
      </div>
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
