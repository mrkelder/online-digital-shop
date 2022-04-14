import { FC } from "react";

import Link from "next/link";

import { CLOSE_CATALOG_EVENT_NAME } from "constants/header";

const SubCategory: FC<{ subCategory: SubCategory }> = ({ subCategory }) => {
  const closeCatalog = () => {
    const event = new Event(CLOSE_CATALOG_EVENT_NAME);
    dispatchEvent(event);
  };

  return (
    <Link href={`/catalog?subCategoryId=${subCategory._id}`}>
      <a
        onClick={closeCatalog}
        className="w-1/4 border-b-2 text-grey-600 border-grey-100 ont-light text-xl font-semibold"
      >
        {subCategory.name}
      </a>
    </Link>
  );
};

export default SubCategory;
