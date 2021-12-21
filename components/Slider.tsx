import { FC } from "react";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper";
import "swiper/css/pagination";
import "swiper/css";

const Slider: FC<{ slides: string[] }> = ({ slides }) => {
  const swiperParams: SwiperProps = {
    slidesPerView: 1,
    modules: [Autoplay, Pagination],
    autoplay: { disableOnInteraction: false, delay: 4500 },
    pagination: { clickable: true }
  };

  return (
    <div className="my-2 relative flex justify-center w-full lg:my-0 lg:max-w-7xl lg:mx-auto">
      <Swiper {...swiperParams}>
        {slides.map(i => (
          <SwiperSlide key={i}>
            <img src={i} className="mx-auto" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
