import { FC } from "react";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper";
import "swiper/css/pagination";
import "swiper/css";

const swiperParams: SwiperProps = {
  slidesPerView: 1,
  modules: [Autoplay, Pagination],
  autoplay: { disableOnInteraction: false, delay: 4500 },
  pagination: { clickable: true }
};

const Slider: FC<{
  slides: ReadonlyArray<{ mobile: string; desktop: string }>;
}> = ({ slides }) => {
  return (
    <div className="my-2 relative flex justify-center w-full lg:my-0 lg:max-w-7xl lg:mx-auto">
      <Swiper {...swiperParams}>
        {slides.map((i, index) => (
          <SwiperSlide key={`slide_${index}`}>
            <picture className="flex justify-center">
              <source srcSet={i.desktop} media="(min-width: 1024px)" />
              {/* eslint-disable-next-line */}
              <img src={i.mobile} alt="Баннер" decoding="async" className="" />
              {/* I didn't find any better way, because brining Image component breaks picture tag down */}
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
