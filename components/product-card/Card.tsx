import Link from "next/link";
import { FC } from "react";
import DefaultPhoto from "public/img/default-photo.jpg";
import starActiveIcon from "public/img/star-active.png";
import starIcon from "public/img/star.png";
import Image from "next/image";

interface Props {
  id: string;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  price: number;
  name: string;
  photo: StaticImageData | string;
}

const LINK =
  "https://www.vodafone.ua/shop/media/catalog/product/cache/b194688dfba11ab51374da7d8ad52d29/1/3/134640-samsung-galaxy-s20-fe-2021-6-128gb-sm-g780glvhsek-blue.jpg";

const Card: FC<Props> = ({ rating, price, name, photo, id }) => {
  return (
    <div className="flex flex-col shadow-lg my-10 bg-white w-60 px-3 py-5 text-grey-300">
      <img src={LINK} alt="test" className="h-48 object-contain mb-2" />

      <div className="relative inline h-12 overflow-hidden">
        <Link href="/somelink">
          <a className="text-sm">{name}</a>
        </Link>
        <div className="absolute w-full h-3 bottom-0 left-0 white-shadow" />
      </div>

      <div className="flex">
        {new Array(rating).fill(0).map((_, index) => (
          <div className="w-3" key={`star_${index}`}>
            <Image src={starActiveIcon} alt="Рейтинг" />
          </div>
        ))}
        {new Array(5 - rating).fill(0).map((_, index) => (
          <div className="w-3" key={`star_${index}`}>
            <Image src={starIcon} alt="Рейтинг" />
          </div>
        ))}
      </div>

      <span className="text-red my-1">{price} грн</span>

      <Link href={LINK}>
        <a className="bg-red text-white text-sm p-2 mt-1 text-center">
          Детальнее
        </a>
      </Link>

      <style jsx>{`
        .white-shadow {
          box-shadow: inset 0 -7px 4px 1px white;
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
  photo: DefaultPhoto
};

export default Card;
