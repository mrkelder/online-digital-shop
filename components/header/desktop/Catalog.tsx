import { FC, useContext, useEffect, useRef, useState } from "react";
import { FirebaseContext } from "utils/firebase";
import Tab from "components/header/Tab";
import SubCategory from "./SubCategory";

const Catalog: FC<{ isOpened: boolean }> = ({ isOpened }) => {
  const display = isOpened ? "flex" : "hidden";
  const firebase = useContext(FirebaseContext);
  const menuRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [chosenCategory, setChosenCategory] = useState("");
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    async function fetch() {
      const data = await firebase.getAllDocumentsInCollection<Category>(
        "categories"
      );
      setCategories(data);
    }

    fetch();
  }, [firebase]);

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
      // FIXME: deal with e.path problem
      const path = e.path || (e.composedPath && e.composedPath());
      if (!path.includes(menuRef.current)) {
        dispatchCloseEvent();
      }
    }

    addEventListener("click", handleClickOutside);
    return () => {
      removeEventListener("click", handleClickOutside);
    };
  }, []);

  const dispatchCloseEvent = () => {
    const event = new Event("close-catalog");
    window.dispatchEvent(event);
  };

  function chooseCategory(id: string) {
    return async () => {
      const data = await firebase.getSubCategories(id);
      setChosenCategory(id);
      setSubCategories(data);
    };
  }

  return (
    <div
      className={`absolute z-20 bg-grey-transparent left-0 w-full justify-center ${display}`}
      style={{ top: "84px", height: "calc(100vh - 84px)" }}
    >
      <div
        className="h-96 w-2/3 max-w-7xl bg-white grid grid-cols-4 grid-flo"
        ref={menuRef}
      >
        <div className="col-span-1">
          {categories.map(i => (
            <Tab
              key={i.id}
              name={i.name}
              onClick={chooseCategory(i.id)}
              focused={chosenCategory === i.id}
              showIcon
            />
          ))}
        </div>
        <div className="col-span-3 bg-grey-75 flex flex-col flex-wrap p-3 space-y-4">
          {subCategories.map(i => (
            <SubCategory key={i.id} subCategory={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
