import { FC } from "react";

import Image from "next/image";
import Link from "next/link";

import DefaultPhoto from "public/img/default-photo.jpg";

interface Props {
  _id: Item["_id"];
  name: Item["name"];
  price: Item["price"];
  photo: Item["photo"];
  resetSearch: () => void;
}

const SearchItem: FC<Props> = ({ _id, name, price, photo, resetSearch }) => {
  const totalPhoto = photo
    ? process.env.NEXT_PUBLIC_STATIC_HOST + photo
    : DefaultPhoto;

  return (
    <div className="flex px-2 bg-white py-2">
      <div className="relative w-14 h-14 mr-4">
        <Image
          src={totalPhoto}
          objectFit="contain"
          objectPosition="50%"
          alt="Фото"
          layout="fill"
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Link href={`/products/${_id}`}>
          <a className="truncate text-base text-grey-600" onClick={resetSearch}>
            {name}
          </a>
        </Link>
        <span className="text-red text-sm">{price} грн</span>
      </div>
    </div>
  );
};

SearchItem.defaultProps = {
  _id: "none",
  name: "Item",
  price: 9999,
  resetSearch: () => {}
};

export default SearchItem;
