import { FC } from "react";

import { useRouter } from "next/router";

import Tab from "components/header/Tab";
import ArrowIcon from "public/img/arrow.svg";

const SubCategories: FC<{
  isOpened: boolean;
  closeSubMenu: () => void;
  closeMenu: () => void;
  subCategories: SubCategory[];
}> = ({ isOpened, closeSubMenu, closeMenu, subCategories }) => {
  const { push } = useRouter();
  const tabIndex = isOpened ? 0 : -1;

  function changeLink(link: string) {
    return () => {
      closeMenu();
      push(link);
    };
  }

  const translate = isOpened ? "translate-x-0" : "translate-x-full";

  return (
    <div
      className={`absolute top-0 left-0 w-full h-screen bg-white z-20 transition-transform transform ${translate}`}
    >
      <div className="bg-red text-white h-14 flex justify-center items-center relative">
        <button
          className="w-3 absolute left-4"
          onClick={closeSubMenu}
          tabIndex={tabIndex}
        >
          <ArrowIcon />
        </button>
        <span className="font-light text-lg">Каталог</span>
      </div>
      <div className="lex flex-col overflow-y-auto h-full flex-1 relative">
        {subCategories.map(i => (
          <Tab
            key={i._id}
            name={i.name}
            onClick={changeLink(`/catalog?subCategoryId=${i._id}`)}
            tabIndex={tabIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default SubCategories;
