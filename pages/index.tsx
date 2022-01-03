import { useContext, useEffect, useState } from "react";
import Slider from "components/Slider";
import Head from "next/head";
import type { GetServerSideProps, NextPage } from "next";
import Firebase, { FirebaseContext } from "utils/firebase";
import GuaranteeIcon from "public/img/guarantee.svg";
import LikeIcon from "public/img/like.svg";
import TruckIcon from "public/img/truck.svg";
import Card from "components/product-card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type SlideNames = { slideNames: string[] };

const DESKTOP_SLIDE_BREAKPOINT = 1024;

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

const Home: NextPage<SlideNames> = ({ slideNames }) => {
  const firebase = useContext(FirebaseContext);
  const [slides, setSlides] = useState<string[]>([]);

  useEffect(() => {
    // FIXME: remove js from slide fetching logic (use <picture> tag)

    async function fetch() {
      // FIXME: remove this, this eliminates any sense to use SSR
      const SLIDER_DIR =
        "slider/" +
        (window.innerWidth < DESKTOP_SLIDE_BREAKPOINT ? "mobile" : "desktop");
      const slideLinks = await firebase.downloadFiles(SLIDER_DIR, slideNames);
      setSlides(slideLinks);
    }

    fetch();
  }, [firebase, slideNames]);

  return (
    <>
      <Head>
        <title>New London</title>
      </Head>

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

      <section className="flex flex-col items-center">
        <strong className="font-light text-2xl mt-5 mx-5 text-center lg:text-4xl lg:mt-4 lg:mb-3">
          Лучшие предложения на{" "}
          <span className="text-red text-2xl font-light lg:text-4xl">
            сегодня
          </span>
        </strong>

        <div className="w-full my-3">
          <Swiper breakpoints={swiperBreakpoints}>
            {new Array(10).fill(0).map((_, index) => (
              <SwiperSlide key={`slide_${index}`}>
                <div className="w-full flex justify-center">
                  <Card />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<SlideNames> = async () => {
  const firebase = new Firebase();
  const slides = await firebase.getAllSlides();
  const slideNames = slides.map(i => i.name);
  return { props: { slideNames }, notFound: false };
};

export default Home;
