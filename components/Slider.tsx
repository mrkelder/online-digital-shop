import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const Slider: FC<{ slides: string[] }> = ({ slides }) => {
  return (
    <div className="my-2 w-full">
      <Swiper slidesPerView={1}>
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
