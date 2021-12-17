import { FC } from "react";
import Link from "next/link";

const SubCategory: FC<{ subCategory: SubCategory }> = ({ subCategory }) => {
  return (
    <Link href={`/${subCategory.name}`}>
      <a>{subCategory.name}</a>
    </Link>
  );
};

export default SubCategory;
