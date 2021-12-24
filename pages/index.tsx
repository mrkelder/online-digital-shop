import { useContext, useEffect, useState } from "react";
import Slider from "components/Slider";
import Head from "next/head";
import type { GetServerSideProps, NextPage } from "next";
import Firebase, { FirebaseContext } from "utils/firebase";
import GuaranteeIcon from "public/img/guarantee.svg";
import LikeIcon from "public/img/like.svg";
import TruckIcon from "public/img/truck.svg";

type SlideNames = { slideNames: string[] };

const DESKTOP_SLIDE_BREAKPOINT = 1024;

const advantages = [
  { img: LikeIcon, text: "Пополнение счета без комиссии" },
  { img: TruckIcon, text: "Бесплатная доставка в магазины" },
  { img: GuaranteeIcon, text: "Официальная гарантия от производителя" }
];

const Home: NextPage<SlideNames> = ({ slideNames }) => {
  const firebase = useContext(FirebaseContext);
  const [slides, setSlides] = useState<string[]>([]);

  useEffect(() => {
    // FIXME: remove js from slide fetching logic (use <picture> tag)

    async function fetch() {
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

      <ul className="hidden lg:px-2 lg:py-5 lg:justify-center lg:space-x-10 lg:flex lg:bg-grey-400 lg:text-white w-full">
        {advantages.map(I => (
          <li className="flex flex-col items-center" key={I.text}>
            <span className="w-8">
              <I.img />
            </span>
            <p className="font-regular w-48 text-center">{I.text}</p>
          </li>
        ))}
      </ul>
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
