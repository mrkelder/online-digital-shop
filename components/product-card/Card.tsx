import { FC } from "react";

import Image from "next/image";
import Link from "next/link";

import Button from "components/Button";
import DefaultPhoto from "public/img/default-photo.jpg";
import starActiveIcon from "public/img/star-active.png";
import starIcon from "public/img/star.png";


type Props = Pick<
  FirebaseProduct,
  "rating" | "price" | "name" | "photo" | "id"
>;

const Card: FC<Props> = ({ rating, price, name, photo, id }) => {
  const link = `/products/${id}`;

  return (
    <div className="flex flex-col shadow-lg bg-white w-60 px-3 py-5 text-grey-300 lg:w-80 lg:px-5 lg:py-6">
      <Link href={link}>
        <a className="relative h-44 mb-2 lg:h-64">
          {photo ? (
            // FIXME: Keep in mind, the photo won't probably work on server
            <Image
              src={photo.image2x}
              alt="Фотография товара"
              objectFit="contain"
              layout="fill"
            />
          ) : (
            <Image
              src={DefaultPhoto}
              alt="Фотография товара"
              objectFit="contain"
              layout="fill"
            />
          )}
        </a>
      </Link>

      <div className="relative inline h-12 overflow-hidden lg:h-14 ">
        <Link href={link}>
          <a className="text-sm lg:text-lg">{name}</a>
        </Link>
        <div className="absolute w-full h-3 bottom-0 left-0 white-shadow lg:h-4" />
      </div>

      <div className="flex space-x-1 lg:mt-1">
        {new Array(rating).fill(0).map((_, index) => (
          <div className="w-3 lg:w-4" key={`star_${index}`}>
            <Image src={starActiveIcon} alt="Рейтинг" />
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
        <a className="mt-1">
          <Button>Детальнее</Button>
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
  id: "none",
  rating: 3,
  price: 9999,
  name: "Смартфон Samsung Galaxy A52 4/128GB Black Смартфон Samsung Galaxy A52 4/128GB Black Смартфон Samsung Galaxy A52 4/128GB Black Смартфон Samsung Galaxy A52 4/128GB Black",
  photo: null
};

export default Card;
