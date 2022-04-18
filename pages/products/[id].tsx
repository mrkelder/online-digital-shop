import { Dispatch, useRef, useState } from "react";

import { GetServerSideProps, NextPage } from "next";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { FreeMode, Navigation, SwiperOptions } from "swiper";
import type Swiper from "swiper";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";

import ArrowButton from "components/ArrowButton";
import Button from "components/Button";
import ContentWrapper from "components/ContentWrapper";
import MailNotification from "components/MailNotification";
import ItemPageMeta from "components/meta/ItemPageMeta";
import Characteristics from "components/product-page/Characteristics";
import useLanguage from "hooks/useLanguage";
import useMatchMedia from "hooks/useMatchMedia";
import ArrowIcon from "public/img/arrow.svg";
import DefaultPhoto from "public/img/default-photo.jpg";
import LocationIcon from "public/img/geo-point.svg";
import activeStarIcon from "public/img/star-active.png";
import starIcon from "public/img/star.png";
import styles from "styles/item-page.module.css";
import { CartActions, CartState } from "types/cart-reducer";
import type { RootStore } from "types/store";
import DTO from "utils/DTO";

import "swiper/css";
import "swiper/css/free-mode";

interface Props {
  itemObj: Item;
}

const SWIPER_LEFT_NAVIGATION = "photos_navigation_left";
const SWIPER_RIGHT_NAVIGATION = "photos_navigation_right";
const MAXIMUM_RATING = 5;

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

const ProductPage: NextPage<Props> = ({ itemObj }) => {
  const { langVariant } = useLanguage();
  const swiperInstance = useRef<null | Swiper>(null);
  const dispatch = useDispatch<Dispatch<CartActions>>();
  const [chosenPhotoIndex, setChosenPhotoIndex] = useState(0);
  const { isMobile, isLoaded } = useMatchMedia();
  const items = useSelector<RootStore>(
    store => store.cart.items
  ) as CartState["items"];
  const buttonProperty = items.find(i => i._id === itemObj._id)
    ? { color: "grey", text: langVariant("В кошик", "В корзине") }
    : { color: "red", text: langVariant("Купити", "Купить") };

  function createStars(starIcon: StaticImageData, quantity: number) {
    return new Array(quantity).fill(0).map((_, index) => (
      <div className="relative w-4 h-4" key={`astar-${index}`}>
        <Image
          src={starIcon}
          alt={langVariant("Позитивна оцінка", "Положительная оценка")}
          layout="fill"
        />
      </div>
    ));
  }

  function switchCurrentSlideToFocused(index: number) {
    return () => {
      const instance = swiperInstance.current;
      if (instance) {
        instance.slideTo(index);
      }
    };
  }

  const addItemToCart = () => {
    dispatch({
      type: "cart/addItem",
      payload: DTO.productToReduxCartProduct(itemObj)
    });
  };

  const choosePhotoIndex = (index: number) => {
    return () => {
      setChosenPhotoIndex(index);
    };
  };

  const currentPhotoStyling = (index: number) =>
    (chosenPhotoIndex === index ? "lg:opacity-50" : "lg:opacity-100") +
    " transition";

  const resolveDaySchedule = (schedule: Shop["schedule"]) => {
    const date = new Date();
    const timetable = schedule[date.getDay()];
    if (timetable)
      return `${langVariant("Сьогодні з", "Сегодня с")} ${
        timetable.from
      } ${langVariant("до", "по")} ${timetable.to}`;
    else return langVariant("Сьогодні вхідний", "Сегодня ваходной");
  };

  const activeStars = createStars(activeStarIcon, itemObj.rating);
  const inactiveStars = createStars(starIcon, MAXIMUM_RATING - itemObj.rating);

  return (
    <>
      <ItemPageMeta itemObj={itemObj} />

      <Link
        href={{
          pathname: "/catalog",
          query: { subCategoryId: itemObj.subCategory }
        }}
      >
        <a className="mt-1 flex items-center text-grey-400 text-sm lg:mx-0">
          <span className="w-1 inline-block mr-1">
            <ArrowIcon />
          </span>
          {langVariant("На сторінку підкатегорій", "На страницу подкатегорий")}
        </a>
      </Link>
      <h1 className="text-xl font-bold text-grey-400">{itemObj.name}</h1>
      <div className="flex mb-2 lg:mx-0">
        {activeStars}
        {inactiveStars}
      </div>
      <div className="flex flex-col mb-2 lg:flex-row lg:space-x-5">
        <div className="lg:bg-white box-border lg:flex-1 lg:p-4 lg:shadow-xl lg:flex lg:flex-col lg:items-center">
          <div className="hidden relative w-full h-96 mb-5 lg:block">
            <Image
              src={
                process.env.NEXT_PUBLIC_STATIC_HOST +
                itemObj.photos[chosenPhotoIndex]
              }
              layout="fill"
              alt={langVariant("Фото товару", "Фото товара")}
              objectFit="contain"
              objectPosition="50%"
              priority
            />
          </div>
          <div className="flex items-center relative mb-2 w-full overflow-hidden lg:w-1/2">
            <ArrowButton
              size={6}
              buttonClassName={SWIPER_LEFT_NAVIGATION}
              arrowIconSize={1.5}
            />
            <SwiperComponent
              {...swiperConf}
              onSwiper={s => (swiperInstance.current = s)}
            >
              {itemObj.photos.map((photo, index) => (
                <SwiperSlide key={`slide_${index}`}>
                  <div className="h-52 lg:h-16">
                    <button
                      className={`w-full mx-auto relative bg-white border h-full border-grey-100 lg:w-16 lg:border-none ${
                        isLoaded ? "block" : "hidden"
                      }`}
                      onClick={choosePhotoIndex(index)}
                      onFocus={switchCurrentSlideToFocused(index)}
                    >
                      {photo ? (
                        <Image
                          className={currentPhotoStyling(index)}
                          src={process.env.NEXT_PUBLIC_STATIC_HOST + photo}
                          layout={isMobile ? "fill" : "intrinsic"}
                          width={isMobile ? undefined : 64}
                          height={isMobile ? undefined : 64}
                          objectFit="contain"
                          objectPosition="center"
                          alt={langVariant("Фото товару", "Фото товара")}
                          priority
                        />
                      ) : (
                        <Image
                          layout="fill"
                          src={DefaultPhoto}
                          alt={langVariant("Фото товару", "Фото товара")}
                          objectFit="cover"
                          objectPosition="50%"
                          priority
                        />
                      )}
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </SwiperComponent>
            <ArrowButton
              side="right"
              buttonClassName={SWIPER_RIGHT_NAVIGATION}
              size={6}
              arrowIconSize={1.5}
            />
          </div>
        </div>
        <div className="box-border lg:flex-1 lg:bg-white lg:shadow-xl lg:p-4">
          <p className="text-red text-2xl mb-1 text-light lg:text-grey-500 lg:mx-0 lg:text-3xl lg:mb-2.5">
            {itemObj.price} грн
          </p>
          <div className="lg:hidden">
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
                : "inline" + " mt-1 text-grey-300 lg:mx-0"
            }
          >
            {langVariant("Немає в наявності", "Нет в наличии")}
          </b>
          <hr className="hidden mt-2 lg:block" />
          <h2 className="text-base font-regular mt-2 text-grey-650 lg:text-lg">
            {langVariant("Ключові особливості", "Ключевые особенности")}
          </h2>
          <table className={styles["table"]}>
            <tbody>
              {itemObj.key_characteristics.length === 0 && (
                <p className="text-sm text-grey-300 italic">
                  {langVariant(
                    "Ключових характеристик поки що немає",
                    "Ключевых характеристик пока нет"
                  )}
                </p>
              )}
              {itemObj.key_characteristics
                .map(index => itemObj.characteristics[index])
                .map(({ c, values }, index) => (
                  <tr key={`c_${index}`}>
                    <th className={styles["th-name"]}>{c.name}</th>
                    <th className={styles["th-value"]}>
                      {DTO.mongodbCharacteristicValueToString(c.values, values)}
                    </th>
                  </tr>
                ))}
            </tbody>
          </table>
          <hr className="hidden mb-2 lg:block" />
          <a
            href="#all-characteristics"
            className="text-sm underline font-regular mt-2 mb-10 text-grey-650 lg:hidden"
          >
            {langVariant(
              "Показати всі характеристики",
              "Показать все характеристики"
            )}
          </a>
          <div className="my-3 lg:my-1">
            <h2 className="text-grey-650 font-regular text-lg mb-1 flex items-center lg:text-lg lg:mb-2">
              {langVariant("Доступні магазини", "Доступные магазины")}
              <span className="inline-block w-2.5 ml-1 text-red">
                <LocationIcon />
              </span>
            </h2>
            {itemObj.available_in.map((i, index) => (
              <div key={`city_${index}`} className="flex flex-col mb-2 lg:mb-3">
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
              <p className="text-base my-2 mx-3 text-grey-600">
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
        <h2>{langVariant("Опис", "Описание")}</h2>
        <p className="text-base text-grey-600 mt-1">{itemObj.description}</p>
      </div>
      <div className="hidden bg-white p-4 mb-2 lg:block">
        <h2>Характеристики</h2>
        <Characteristics characteristics={itemObj.characteristics} />
      </div>
      <MailNotification />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const itemFetch = await fetch(
      process.env.NEXT_PUBLIC_HOSTNAME + "/api/getItem/" + context.params?.id
    );
    const itemObj: Item = await itemFetch.json();
    return {
      props: { itemObj }
    };
  } catch {
    return {
      notFound: true
    };
  }
};

export default ProductPage;
