import { FC } from "react";

import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";

import Picture from "components/Picture";
import useLanguage from "hooks/useLanguage";
import "swiper/css/pagination";
import "swiper/css";

interface Props {
  slides: ReadonlyArray<{ mobile: string; desktop: string }>;
}

const swiperParams: SwiperProps = {
  slidesPerView: 1,
  modules: [Autoplay, Pagination],
  autoplay: { disableOnInteraction: false, delay: 4500 },
  pagination: { clickable: true }
};

const Slider: FC<Props> = ({ slides }) => {
  const { langVariant } = useLanguage();
  const errorMessageStyle = slides.length === 0 ? "block" : "hidden";

  return (
    <>
      <b className={errorMessageStyle + " text-center"}>Слайдер пуст</b>

      <div className="slider my-2 relative max-w-md mx-auto flex justify-center w-full lg:my-0 lg:max-w-7xl lg:mx-auto">
        <Swiper {...swiperParams}>
          {slides.map((i, index) => (
            <SwiperSlide key={`slide_${index}`}>
              <Picture
                image1x={process.env.NEXT_PUBLIC_STATIC_HOST + i.mobile}
                image2x={process.env.NEXT_PUBLIC_STATIC_HOST + i.desktop}
                alt={langVariant("Банер", "Баннер")}
              />
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
