import { FC } from "react";
import Image from "next/image";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper";
import "swiper/css/pagination";
import "swiper/css";

const Slider: FC<{ slides: string[] }> = ({ slides }) => {
  // FIXME: slides aren't shown properly on desktop devices (they come out of view scope)

  const swiperParams: SwiperProps = {
    slidesPerView: 1,
    modules: [Autoplay, Pagination],
    autoplay: { disableOnInteraction: false, delay: 4500 },
    pagination: { clickable: true }
  };

  return (
    <div className="my-2 relative flex justify-center w-full h-130 lg:h-86 lg:my-0 lg:max-w-7xl lg:mx-auto ">
      <Swiper {...swiperParams}>
        {slides.map(i => (
          <SwiperSlide key={i}>
            <div className="mx-auto relative w-120 h-130 lg:w-215 lg:h-86">
              <Image src={i} layout="fill" priority alt="Баннер" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
