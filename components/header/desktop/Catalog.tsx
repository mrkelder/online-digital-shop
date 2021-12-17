import { FC, useContext, useEffect, useState } from "react";
import { FirebaseContext } from "utils/firebase";
import Tab from "components/header/Tab";
import SubCategory from "./SubCategory";

const Catalog: FC<{ isOpened: boolean }> = ({ isOpened }) => {
  const display = isOpened ? "flex" : "hidden";
  const firebase = useContext(FirebaseContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [chosenCategory, setChosenCategory] = useState("");
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    async function fetch() {
      const data = await firebase.getCategories();
      setCategories(data);
    }

    fetch();
  }, [firebase]);

  function chooseCategory(id: string) {
    return async () => {
      const data = await firebase.getSubCategories(id);
      setChosenCategory(id);
      setSubCategories(data);
    };
  }

  return (
    <div
      className={`absolute bg-grey-transparent left-0 w-screen justify-center ${display}`}
      style={{ top: "84px", height: "calc(100vh - 84px)" }}
    >
      <div className="h-56 w-1/2 bg-white grid grid-cols-4">
        <div className="col-span-1">
          {categories.map(i => (
            <Tab
              key={i.id}
              name={i.name}
              onClick={chooseCategory(i.id)}
              focused={chosenCategory === i.id}
            />
          ))}
        </div>
        <div className="col-span-3 bg-grey-100">
          {subCategories.map(i => (
            <SubCategory key={i.id} subCategory={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
