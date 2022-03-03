import type { GetServerSideProps, NextPage } from "next";
import { Autoplay, Navigation, SwiperOptions } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import ArrowButton from "components/ArrowButton";
import MailNotification from "components/MailNotification";
import ShopMap from "components/map/ShopMap";
import MetaHead from "components/meta/MetaHead";
import Card from "components/product-card/Card";
import Slider from "components/Slider";
import GuaranteeIcon from "public/img/guarantee.svg";
import LikeIcon from "public/img/like.svg";
import TruckIcon from "public/img/truck.svg";
import serializeShop from "utils/dto/serializeShop";
import Firebase from "utils/firebase";

import "swiper/css";
import "swiper/css/autoplay";

interface Props {
  slides: ReadonlyArray<{ mobile: string; desktop: string }>;
  reccommendedItems: ReadonlyArray<Product>;
  geoInfo: GeoInfo;
}

const advantages = [
  { img: LikeIcon, text: "Пополнение счета без комиссии" },
  { img: TruckIcon, text: "Бесплатная доставка в магазины" },
  { img: GuaranteeIcon, text: "Официальная гарантия от производителя" }
];

const swiperBreakpoints = {
  320: {
    slidesPerView: 1,
    spaceBetween: 25
  },
  500: {
    slidesPerView: 2,
    spaceBetween: 15
  },
  700: {
    slidesPerView: 3,
    spaceBetween: 25
  },
  1000: {
    slidesPerView: 4,
    spaceBetween: 25
  }
};

const swiperConfig: SwiperOptions = {
  modules: [Autoplay, Navigation],
  breakpoints: swiperBreakpoints,
  autoplay: {
    delay: 3500
  },
  navigation: {
    prevEl: ".items_navigation_left",
    nextEl: ".items_navigation_right"
  }
};

const Home: NextPage<Props> = ({ slides, reccommendedItems, geoInfo }) => {
  const geoInfoCondition =
    geoInfo.cities.length !== 0 && geoInfo.shops.length !== 0;

  const isRecommenedItemsEmpty = reccommendedItems.length !== 0;

  return (
    <>
      <MetaHead />

      <section>
        <Slider {...{ slides }} />

        <ul className="flex flex-col bg-grey-400 w-full text-white p-5 lg:px-2 lg:justify-center lg:space-x-10 lg:flex-row">
          {advantages.map(I => (
            <li
              className="flex p-4 h-20 border items-center lg:p-0 lg:flex-col lg:border-none"
              key={I.text}
            >
              <span className="w-8">
                <I.img />
              </span>
              <p className="font-regular ml-4 lg:ml-0 lg:w-48 lg:text-center">
                {I.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col items-center">
        <strong className="font-light text-2xl mt-5 mx-5 text-center lg:text-4xl lg:mt-4 lg:mb-3">
          {/* TODO: extract to a separate file */}
          Лучшие предложения на{" "}
          <span className="text-red text-2xl font-light lg:text-4xl">
            сегодня
          </span>
        </strong>

        {!isRecommenedItemsEmpty && (
          <b className="mx-auto">Лучших предложений пока нет</b>
        )}

        <div className="flex items-center w-full my-3 relative">
          {/* TODO: extract to a separate file */}

          {isRecommenedItemsEmpty && (
            <ArrowButton buttonClassName="items_navigation_left" />
          )}
          <Swiper {...swiperConfig}>
            {reccommendedItems.map(item => (
              <SwiperSlide key={`slide_${item.id}`}>
                <div className="w-full flex justify-center">
                  <Card
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    photo={item.photo}
                    rating={item.rating}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {isRecommenedItemsEmpty && (
            <ArrowButton
              buttonClassName="items_navigation_right"
              side="right"
            />
          )}
        </div>
      </section>
      <section className="flex flex-col items-center my-2">
        <strong className="font-light text-2xl mt-5 mb-2 mx-5 text-center lg:text-4xl lg:mt-4 lg:mb-5">
          Магазины{" "}
          <span className="text-red text-2xl font-light lg:text-4xl">
            New London
          </span>{" "}
          на карте
        </strong>
        <div className="w-full">
          {geoInfoCondition ? (
            <ShopMap {...{ geoInfo }} />
          ) : (
            <div className="w-full bg-grey-500 text-white text-xl h-86 flex items-center justify-center text-center px-2 lg:h-130">
              Возникла проблема при загрузке карты
            </div>
          )}
        </div>
      </section>
      <MailNotification />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const firebase = new Firebase();
  const dbSlides = await firebase.getAllDocumentsInCollection<Slide>("slider");
  const dbReccommendations =
    await firebase.getAllDocumentsInCollection<Reccommendation>(
      "reccommendations"
    );
  const slideNames = dbSlides.map(i => i.name);

  const mobile = await firebase.downloadFiles("slider/mobile", slideNames);
  const desktop = await firebase.downloadFiles("slider/desktop", slideNames);

  const slides = mobile.map((i, index) => ({
    mobile: i,
    desktop: desktop[index]
  }));

  const reccommendations = dbReccommendations.map(i => i.item_id);
  const reccommendedItems = await firebase.getDocumentsById(
    "products",
    reccommendations
  );

  const shops = await firebase.getAllDocumentsInCollection<FirebaseShop>(
    "shops"
  );
  const cities = await firebase.getAllDocumentsInCollection<City>("cities");

  const geoInfo: GeoInfo = {
    shops: shops.map(shop => serializeShop(shop)),
    cities
  };

  return {
    props: { slides, reccommendedItems, geoInfo }
  };
};

export default Home;
