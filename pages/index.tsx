import { useContext, useEffect, useState } from "react";
import Slider from "components/Slider";
import Head from "next/head";
import type { GetServerSideProps, NextPage } from "next";
import Firebase, { FirebaseContext } from "utils/firebase";

type SlideNames = { slideNames: string[] };

const DESKTOP_SLIDE_BREAKPOINT = 1024;

const Home: NextPage<SlideNames> = ({ slideNames }) => {
  const firebase = useContext(FirebaseContext);
  const [slides, setSlides] = useState<string[]>([]);

  useEffect(() => {
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
      <p>test</p>
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
