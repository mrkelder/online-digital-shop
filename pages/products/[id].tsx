import Button from "components/Button";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Firebase from "utils/firebase";
import DefaultPhoto from "public/img/default-photo.jpg";
import activeStarIcon from "public/img/star-active.png";
import starIcon from "public/img/star.png";
import ContentWrapper from "components/ContentWrapper";
import Characteristics from "components/product-page/Characteristics";
import styles from "styles/item-page.module.css";
import LocationIcon from "public/img/geo-point.svg";
import Link from "next/link";
import ArrowIcon from "public/img/arrow.svg";
import Head from "next/head";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, SwiperOptions } from "swiper";
import { Dispatch, useEffect, useState } from "react";
import MailNotification from "components/MailNotification";
import "swiper/css";
import "swiper/css/free-mode";
import { useDispatch, useSelector } from "react-redux";
import { CartActions, CartState } from "store/cartReducer";
import { RootStore } from "store";
import convertToReduxCartProduct from "utils/dto/convertToReduxCartProduct";
import firebaseProductToProduct from "utils/firebaseProductToProduct";
import Script from "next/script";
import ArrowButton from "components/ArrowButton";

interface Props {
  itemObj: Product;
}

const SWIPER_LEFT_NAVIGATION = "photos_navigation_left";
const SWIPER_RIGHT_NAVIGATION = "photos_navigation_right";

const swiperConf: SwiperOptions = {
  modules: [FreeMode, Navigation],
  freeMode: true,
  slidesPerView: 2.4,
  navigation: {
    prevEl: `.${SWIPER_LEFT_NAVIGATION}`,
    nextEl: `.${SWIPER_RIGHT_NAVIGATION}`
  },
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
  const dispatch = useDispatch<Dispatch<CartActions>>();
  const activeStars = createStars(activeStarIcon, itemObj.rating);
  const inactiveStars = createStars(starIcon, MAXIMUM_RATING - itemObj.rating);
  const [chosenPhotoIndex, setChosenPhotoIndex] = useState(0);
  const [innerWidth, setInnerWidth] = useState(1024);
  const isMobile = innerWidth < 1024;
  const items = useSelector<RootStore>(
    store => store.cart.items
  ) as CartState["items"];
  const buttonProperty = items.find(i => i.id === itemObj.id)
    ? { color: "grey", text: "В корзине" }
    : { color: "red", text: "Купить" };
  // FIXME: render conditionally
  // TODO: add side buttons for photo selector
  // TODO: prefetch all photos to prevent lagging while swithcing between photos

  useEffect(() => {
    function handleResize() {
      setInnerWidth(window.innerWidth);
    }

    handleResize();

    addEventListener("resize", handleResize);

    return () => {
      removeEventListener("resize", handleResize);
    };
  }, []);

  const addItemToCart = () =>
    dispatch({
      type: "cart/addItem",
      payload: convertToReduxCartProduct(itemObj)
    });

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
    <div itemScope itemType="https://schema.org/OfferForPurchase">
      <Head>
        <title>{itemObj.name}</title>
        <meta name="keywords" content={itemObj.name} />
        <meta name="description" content={itemObj.description} />
        <meta name="author" content="New London" />
      </Head>

      <Script id="product-structured-data" type="application/ld+json">{`
      {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "${itemObj.name}",
        "image": ["${itemObj.photo?.image2x}"],
        "description": "${itemObj.description}",
        "aggregateRating": {
          "@type": "AggregateRating",
          "itemReviewed": {
            "@type": "Thing",
            "name": "${itemObj.name}"
          },
          "bestRating": "5",
          "worstRating": "0",
          "ratingCount": "1",
          "ratingValue": "${itemObj.rating.toString()}"
        },
        "price": "${itemObj.price.toString()}",
        "priceCurrency": "UAH",
        "availability": "${itemObj.available ? "In Stock" : "Out of stock"}"
      }
      `}</Script>

      <div itemProp="aggregateRating" itemScope>
        <meta itemProp="ratingValue" content={itemObj.rating.toString()} />
        <meta itemProp="bestRating" content="5" />
        <meta itemProp="worstRating" content="0" />
        <meta itemProp="ratingCount" content="1" />
        <meta itemProp="itemReviewed" content={itemObj.name} />
      </div>

      <meta itemProp="price" content={itemObj.price.toString()} />
      <meta itemProp="priceCurrency" content="UAH" />

      <meta
        itemProp="availability"
        content={itemObj.available ? "In Stock" : "Out of stock"}
      />

      <meta itemProp="image" content={itemObj.photo?.image2x} />

      <Link
        href={{
          pathname: "/catalog",
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
            {/* FIXME: loader musn't be like that */}
            <Image
              src={itemObj.photos[chosenPhotoIndex].image2x as string}
              loader={() => itemObj.photos[chosenPhotoIndex].image2x as string}
              layout="fill"
              alt="Фото товара"
              objectFit="contain"
              objectPosition="50%"
            />
          </div>
          <div className="flex items-center relative mb-2 w-full px-3.5 overflow-hidden lg:w-1/2">
            <ArrowButton
              size={6}
              buttonClassName={SWIPER_LEFT_NAVIGATION}
              arrowIconSize={1.5}
            />
            <ArrowButton
              side="right"
              buttonClassName={SWIPER_RIGHT_NAVIGATION}
              size={6}
              arrowIconSize={1.5}
            />
            <Swiper {...swiperConf}>
              {itemObj.photos.map((photo, index) => (
                <SwiperSlide
                  key={`slide_${index}`}
                  onClick={choosePhotoIndex(index)}
                >
                  <div className={styles["photo-slide"]}>
                    {photo ? (
                      <Image
                        src={photo.image2x}
                        layout={isMobile ? "fill" : "intrinsic"}
                        width={64}
                        height={64}
                        objectFit="contain"
                        objectPosition="center"
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
            <Button
              variant="lg"
              disabled={!itemObj.available}
              onClick={addItemToCart}
              color={buttonProperty.color as "red" | "grey"}
            >
              {buttonProperty.text}
            </Button>
          </div>
          <div className="hidden lg:block w-48">
            <Button
              variant="sm"
              disabled={!itemObj.available}
              onClick={addItemToCart}
              color={buttonProperty.color as "red" | "grey"}
            >
              {buttonProperty.text}
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
            <ContentWrapper text="Описание" position="first">
              <p className="text-base mx-3.5 my-2 text-grey-600">
                {itemObj.description}
              </p>
            </ContentWrapper>
            <span id="all-characteristics" />
            <ContentWrapper
              text="Характеристики"
              id="all-characteristics"
              openedByDefault
            >
              <Characteristics characteristics={itemObj.characteristics} />
            </ContentWrapper>
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
      <MailNotification />
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

  const itemObj = await firebaseProductToProduct(result[0]);

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
