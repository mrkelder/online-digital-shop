import { FC } from "react";

interface Props {
  image1x: string;
  image2x: string;
  alt: string;
}

const Picture: FC<Props> = ({ alt, image1x, image2x }) => {
  return (
    <picture className="w-full h-full">
      <source srcSet={image2x} media="(min-width: 1024px)" />
      {/* eslint-disable-next-line */}
      <img
        src={image1x}
        decoding="async"
        className="object-contain object-center w-full h-full"
        {...{ alt }}
      />
      {/* I didn't find any better way, because brining Image component breaks picture tag down */}
    </picture>
  );
};

export default Picture;
