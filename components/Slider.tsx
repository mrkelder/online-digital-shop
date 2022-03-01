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
  const errorMessageStyle = slides.length === 0 ? "block" : "hidden";

  return (
    <>
      <b className={errorMessageStyle + " text-center"}>Слайдер пуст</b>

      <div className="slider my-2 relative max-w-md mx-auto flex justify-center w-full lg:my-0 lg:max-w-7xl lg:mx-auto">
        <Swiper {...swiperParams}>
          {slides.map((i, index) => (
            <SwiperSlide key={`slide_${index}`}>
              <Picture image1x={i.mobile} image2x={i.desktop} alt="Баннер" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        .slider {
          /* 1.145 is a proper coefficient for the right height */
          min-height: calc(100vw * 1.145);
        }

        @media (min-width: 473px) {
          .slider {
            min-height: 546px;
          }
        }

        @media (min-width: 1024px) {
          .slider {
            min-height: 261px;
          }
        }
      `}</style>
    </>
  );
};

export default Slider;
