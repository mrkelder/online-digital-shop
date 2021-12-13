import { FC } from "react";
import Tab from "./Tab";
import ArrowIcon from "public/img/arrow.svg";

const SubCategory: FC<{ isOpened: boolean; closeSubMenu: () => void }> = ({
  isOpened,
  closeSubMenu
}) => {
  const translate = isOpened ? "translate-x-0" : "translate-x-full";
  return (
    <div
      className={`absolute top-0 left-0 w-full h-screen bg-white z-20 transition-transform transform ${translate}`}
    >
      <div className="bg-red text-white h-14 flex justify-center items-center relative">
        <button className="w-3 absolute left-4" onClick={closeSubMenu}>
          <ArrowIcon />
        </button>
        <span className="font-light text-lg">Каталог </span>
      </div>
      <Tab onClick={() => {}} />
    </div>
  );
};

export default SubCategory;
