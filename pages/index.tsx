import Slider from "components/Slider";
import Head from "next/head";
import type { GetServerSideProps, NextPage } from "next";
import Firebase from "utils/firebase";
import GuaranteeIcon from "public/img/guarantee.svg";
import LikeIcon from "public/img/like.svg";
import TruckIcon from "public/img/truck.svg";
import Card from "components/product-card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface Props {
  slides: ReadonlyArray<{ mobile: string; desktop: string }>;
  reccommendedItems: ReadonlyArray<Product>;
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

const Home: NextPage<Props> = ({ slides, reccommendedItems }) => {
  return (
    <>
      <Head>
        <title>New London</title>
      </Head>
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
          Лучшие предложения на{" "}
          <span className="text-red text-2xl font-light lg:text-4xl">
            сегодня
          </span>
        </strong>

        <div className="w-full my-3">
          <Swiper breakpoints={swiperBreakpoints}>
            {reccommendedItems.map(item => (
              <SwiperSlide key={`slide_${item.id}`}>
                <div className="w-full flex justify-center">
                  <Card {...item} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
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

  const reccommendedItems = await firebase.fetchDocumentsById(
    "products",
    reccommendations
  );

  return {
    props: { slides, reccommendedItems }
  };
};

export default Home;
