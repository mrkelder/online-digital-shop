import { FC } from "react";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper";
import Picture from "components/Picture";
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
            <Picture image1x={i.mobile} image2x={i.desktop} alt="Баннер" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
