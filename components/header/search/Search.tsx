import { FC, memo, useCallback, useEffect, useRef, useState } from "react";

import Input from "components/Input";
import MobileDialog from "components/MobileDialog";
import { CLOSE_MOBILE_SEARCH_DIALOG_EVENT_NAME } from "constants/header";
import clickOutside from "functions/clickOutside";
import useDebounce from "hooks/useDebounce";
import useLanguage from "hooks/useLanguage";
import useMatchMedia from "hooks/useMatchMedia";
import { SearchItemsResponse } from "types/api";

import SearchItem from "./SearchItem";

interface Props {
  isMobileSearchOpened?: boolean;
}

const Search: FC<Props> = ({ isMobileSearchOpened }) => {
  const debounce = useDebounce();
  const { langVariant } = useLanguage();
  const { isMobile, isLoaded } = useMatchMedia();
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const [itemsList, setItemsList] = useState<SearchItemsResponse>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchManipultor, setSearchManipulator] = useState(false);

  const closeMobileSearchDialog = useCallback(() => {
    const event = new Event(CLOSE_MOBILE_SEARCH_DIALOG_EVENT_NAME);
    dispatchEvent(event);
  }, []);

  const handleSerachChange = useCallback(
    e => {
      const value = e.target.value;

      setSearchManipulator(false);
      setSearchValue(value);
      if (value.length > 0) {
        debounce(async () => {
          const fetchItems = await fetch(
            process.env.NEXT_PUBLIC_HOSTNAME + "/api/searchItems?text=" + value
          );

          const items = await fetchItems.json();

          setItemsList(items.slice(0, 4));
          setSearchManipulator(true);
        });
      } else {
        setItemsList([]);
      }
    },
    [debounce]
  );

  const resetSearch = useCallback(() => {
    setSearchManipulator(false);
    setSearchValue("");
    setItemsList([]);
    closeMobileSearchDialog();
  }, [closeMobileSearchDialog]);

  useEffect(() => {
    const handleClickOutside = (e: Event) =>
      clickOutside(e, desktopSearchRef, () => setSearchManipulator(false));

    addEventListener("click", handleClickOutside);
    return () => {
      removeEventListener("click", handleClickOutside);
    };
  }, []);

  const showMobile = isMobile && isLoaded;
  const showDesktop = !isMobile && isLoaded;

  const itemsNotFound =
    searchManipultor && itemsList.length === 0 && searchValue.length > 0;

  return (
    <>
      {showMobile && (
        <MobileDialog
          opened={isMobileSearchOpened as boolean}
          onClose={closeMobileSearchDialog}
        >
          <div className="bg-white h-14 flex items-center border-b">
            <Input onChange={handleSerachChange} value={searchValue} />
          </div>
          <div className="bg-white">
            {itemsList.map(i => (
              <SearchItem
                _id={i._id}
                name={i.name}
                price={i.price}
                photo={i.photo}
                key={i._id}
                resetSearch={resetSearch}
              />
            ))}
          </div>
          {itemsNotFound && (
            <div className="bg-white border-b px-2 py-4 text-grey-600">
              {langVariant("Результатів немає", "Результатов нет")}
            </div>
          )}
        </MobileDialog>
      )}

      {showDesktop && (
        <div className="w-full mx-5 relative" ref={desktopSearchRef}>
          <Input
            type="search"
            underline
            placeholder={langVariant("Пошук", "Поиск")}
            onChange={handleSerachChange}
            value={searchValue}
          />
          {searchManipultor && (
            <div className="bg-white absolute w-full box-shadow z-30">
              {itemsList.map(i => (
                <SearchItem
                  _id={i._id}
                  name={i.name}
                  price={i.price}
                  photo={i.photo}
                  key={i._id}
                  resetSearch={resetSearch}
                />
              ))}
            </div>
          )}
          {itemsNotFound && (
            <div className="bg-white absolute w-full box-shadow px-2 py-4 text-grey-600 z-30">
              {langVariant("Результатів немає", "Результатов нет")}
            </div>
          )}
        </div>
      )}

      {!isLoaded && <div className="hidden lg:block lg:flex-1" />}
    </>
  );
};

Search.defaultProps = {
  isMobileSearchOpened: false
};

export default memo(Search);
