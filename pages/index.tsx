import type { GetServerSideProps, NextPage } from "next";
import { Autoplay, Navigation, SwiperOptions } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import ArrowButton from "components/ArrowButton";
import MailNotification from "components/MailNotification";
import Map from "components/map/Map";
import MetaHead from "components/meta/MetaHead";
import Card from "components/product-card/Card";
import Slider from "components/Slider";
import useLanguage from "hooks/useLanguage";
import GuaranteeIcon from "public/img/guarantee.svg";
import LikeIcon from "public/img/like.svg";
import TruckIcon from "public/img/truck.svg";
import { GetRecommendationsResponse, GetSliderResponse } from "types/api";

import "swiper/css";
import "swiper/css/autoplay";
interface Props {
  slides: GetSliderResponse;
  recommendedItems: GetRecommendationsResponse;
  cities: City[];
}

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

const Home: NextPage<Props> = ({ slides, recommendedItems, cities }) => {
  const { isUA } = useLanguage();
  const isRecommenedItemsEmpty = recommendedItems.length !== 0;

  const advantages = [
    {
      img: LikeIcon,
      text: isUA
        ? "Поповнення рахунку без комісії"
        : "Пополнение счета без комиссии"
    },
    {
      img: TruckIcon,
      text: isUA
        ? "Безкоштовна доставка в магазини"
        : "Бесплатная доставка в магазины"
    },
    {
      img: GuaranteeIcon,
      text: isUA
        ? "Офіційна гарантія від виробника"
        : "Официальная гарантия от производителя"
    }
  ];

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
          {isUA ? "Найкращі пропозиції на " : "Лучшие предложения на "}
          <span className="text-red text-2xl font-light lg:text-4xl">
            сегодня
          </span>
        </strong>

        {!isRecommenedItemsEmpty && (
          <b className="mx-auto">
            {isUA
              ? "Кращих пропозицій поки що немає"
              : "Лучших предложений пока нет"}
          </b>
        )}

        <div className="flex items-center w-full my-3 relative">
          {/* TODO: extract to a separate file */}

          {isRecommenedItemsEmpty && (
            <ArrowButton buttonClassName="items_navigation_left" />
          )}
          <Swiper {...swiperConfig}>
            {recommendedItems.map(({ item }) => (
              <SwiperSlide key={`slide_${item._id}`}>
                <div className="w-full flex justify-center">
                  <Card
                    _id={item._id}
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
          {isUA ? "Магазини " : "Магазины "}
          <span className="text-red text-2xl font-light lg:text-4xl">
            New London
          </span>
          {isUA ? " на карті" : " на карте"}
        </strong>
        <div className="w-full">
          <Map cities={cities} />
        </div>
      </section>
      <MailNotification />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const slidesFetch = await fetch(
    (process.env.NEXT_PUBLIC_HOSTNAME as string) + "/api/getSlider"
  );
  const citiesFetch = await fetch(
    (process.env.NEXT_PUBLIC_HOSTNAME as string) + "/api/getCity"
  );
  const recommendationsFetch = await fetch(
    (process.env.NEXT_PUBLIC_HOSTNAME as string) + "/api/getRecommendations"
  );

  const recommendedItems: GetRecommendationsResponse =
    await recommendationsFetch.json();
  const slides: GetSliderResponse = await slidesFetch.json();
  const cities = await citiesFetch.json();

  return {
    props: { slides, recommendedItems, cities }
  };
};

export default Home;
