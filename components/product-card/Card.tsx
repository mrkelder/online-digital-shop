import { FC } from "react";

import Image from "next/image";
import Link from "next/link";

import Button from "components/Button";
import useLanguage from "hooks/useLanguage";
import DefaultPhoto from "public/img/default-photo.jpg";
import starActiveIcon from "public/img/star-active.png";
import starIcon from "public/img/star.png";

type Props = Pick<Item, "rating" | "price" | "name" | "photo" | "_id">;

const Card: FC<Props> = ({ rating, price, name, photo, _id }) => {
  const { langVariant } = useLanguage();
  const link = `/products/${_id}`;

  return (
    <div
      className="flex flex-col shadow-lg bg-white w-60 px-3 py-5 text-grey-300 lg:w-80 lg:px-5 lg:py-6"
      itemScope
      itemType="https://schema.org/OfferForPurchase"
    >
      <Link href={link}>
        <a className="relative h-44 mb-2 lg:h-64" itemProp="url">
          {photo ? (
            // FIXME: Keep in mind, the photo won't probably work on server
            <Image
              src={(process.env.NEXT_PUBLIC_STATIC_HOST as string) + photo}
              alt={langVariant("Фотографія товару", "Фотография товара")}
              objectFit="contain"
              layout="fill"
            />
          ) : (
            <Image
              src={DefaultPhoto}
              alt={langVariant("Фотографія товару", "Фотография товара")}
              objectFit="contain"
              layout="fill"
            />
          )}
        </a>
      </Link>

      <div className="relative inline h-12 overflow-hidden lg:h-14 ">
        <Link href={link}>
          <a className="text-sm lg:text-lg" itemProp="url">
            {name}
          </a>
        </Link>
        <div className="absolute w-full h-3 bottom-0 left-0 white-shadow lg:h-4" />
      </div>

      <div className="flex space-x-1 lg:mt-1">
        {new Array(rating).fill(0).map((_, index) => (
          <div className="w-3 lg:w-4" key={`star_${index}`}>
            <Image
              src={starActiveIcon}
              alt={langVariant("Позитивний рейтинг", "Положительный Рейтинг")}
            />
          </div>
        ))}
        {new Array(5 - rating).fill(0).map((_, index) => (
          <div className="w-3 lg:w-4" key={`star_${index}`}>
            <Image src={starIcon} alt="Рейтинг" />
          </div>
        ))}
      </div>

      <span className="text-red my-1 lg:text-xl lg:mt-0">{price} грн</span>

      <Link href={link}>
        <a className="mt-1" itemProp="url">
          <Button>{langVariant("Детальніше", "Детальнее")}</Button>
        </a>
      </Link>

      <style jsx>{`
        .white-shadow {
          box-shadow: inset 0 -7px 4px 1px white;
        }

        @media (min-width: 1024px) {
          .white-shadow {
            box-shadow: inset 0 -10px 7px 1px white;
          }
        }
      `}</style>
    </div>
  );
};

Card.defaultProps = {
  _id: "none",
  rating: 3,
  price: 9999,
  name: "Phone",
  photo: null
};

export default Card;
