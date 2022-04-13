import { FC, useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";

import Tab from "components/header/Tab";
import { CLOSE_CATALOG_EVENT_NAME } from "constants/header";

import SubCategory from "./SubCategory";

interface Props {
  isOpened: boolean;
  categories: Category[];
}

const Catalog: FC<Props> = ({ isOpened, categories }) => {
  const display = isOpened ? "flex" : "hidden";
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [chosenCategoryIndex, setChosenCategoryIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpened) dispatchCloseEvent();
    };

    addEventListener("scroll", handleScroll);
    return () => {
      removeEventListener("scroll", handleScroll);
    };
  }, [isOpened]);

  useEffect(() => {
    function handleClickOutside(e: Event) {
      const path = e.composedPath && e.composedPath();
      if (path && !path.includes(menuRef.current as EventTarget)) {
        dispatchCloseEvent();
      }
    }

    addEventListener("click", handleClickOutside);
    return () => {
      removeEventListener("click", handleClickOutside);
    };
  }, []);

  const navigateToCategoryPage = (id: string) => {
    return () => {
      router.push(`/category?id=${id}`);
      dispatchCloseEvent();
    };
  };

  const dispatchCloseEvent = () => {
    const event = new Event(CLOSE_CATALOG_EVENT_NAME);
    window.dispatchEvent(event);
  };

  function chooseCategory(categoryIndex: number) {
    return () => {
      setChosenCategoryIndex(categoryIndex);
    };
  }

  return (
    <div
      className={`absolute z-50 bg-grey-transparent left-0 w-full justify-center ${display}`}
      style={{ top: "84px", height: "calc(100vh - 84px)" }}
    >
      <div
        className="h-96 w-2/3 max-w-7xl bg-white grid grid-cols-4 grid-flo"
        ref={menuRef}
      >
        <div className="col-span-1">
          {categories &&
            categories.map((i, index) => (
              <Tab
                key={i._id}
                name={i.name}
                onMouseEnter={chooseCategory(index)}
                onClick={navigateToCategoryPage(i._id as string)}
                focused={index === chosenCategoryIndex}
                showIcon
              />
            ))}
        </div>
        <div className="col-span-3 bg-grey-75 flex flex-col flex-wrap p-3 space-y-4">
          {categories[chosenCategoryIndex].subCategories.map(i => (
            <SubCategory key={i._id} subCategory={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
