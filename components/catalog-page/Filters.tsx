import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  useEffect,
  useRef,
  useState
} from "react";

import { useRouter } from "next/router";
import ReactSlider from "react-slider";

import Button from "components/Button";
import ContentWrapper from "components/ContentWrapper";
import Input from "components/Input";
import { CHANGE_FILTERS_EVENT_NAME } from "constants/catalog";
import useLanguage from "hooks/useLanguage";
import { GetItemsResponse } from "types/api";
import { ChangeFiltersEventDetail } from "types/catalog";

type PriceFilterField = "min" | "max";

interface CharacteristicQuery {
  valueIndex: number;
  id: string;
}

interface Props {
  queryPrice: { min: number; max: number };
  maxPrice: number;
  minPrice: number;
  characteristics: GetItemsResponse["characteristics"];
}

const Filters: FC<Props> = ({
  queryPrice,
  minPrice,
  maxPrice,
  characteristics
}) => {
  const router = useRouter();
  const { langVariant } = useLanguage();
  const characteristicsQuery = useRef<Set<string>>(new Set());
  // FIXME: fix inputs, their onChange
  const [priceFilter, setPriceFilter] = useState({
    min: queryPrice.min,
    max: queryPrice.max
  });

  function priceInputHanlder(field: PriceFilterField) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      changePriceValue(Number(e.target.value), field);
    };
  }

  function rangeHandler(values: [number, number]) {
    const [min, max] = values;
    if (min !== priceFilter.min) changePriceValue(min, "min");
    if (max !== priceFilter.max) changePriceValue(max, "max");
  }

  function changePriceValue(value: number, field: PriceFilterField) {
    switch (field) {
      case "min": {
        if (value >= minPrice && value < priceFilter.max)
          changePriceFilter(value, "min");
        return;
      }

      case "max": {
        if (value <= maxPrice && value > priceFilter.min)
          changePriceFilter(value, "max");
        return;
      }

      default:
        console.error("Wrong field attribute");
        return;
    }
  }

  function changePriceFilter(value: number, field: PriceFilterField): void {
    const newState = JSON.parse(JSON.stringify(priceFilter));
    newState[field] = Math.max(Math.min(value, maxPrice), minPrice);
    setPriceFilter(newState);
  }

  const applyCharacteristic: ChangeEventHandler<HTMLInputElement> = e => {
    const { checked, value } = e.target;
    if (checked) characteristicsQuery.current.add(value);
    else characteristicsQuery.current.delete(value);
  };

  function submitCharacteristics() {
    const { route, query } = router;
    const { min, max } = priceFilter;
    const set = characteristicsQuery.current;
    const values: ReadonlyArray<CharacteristicQuery> = Array.from(set).map(i =>
      JSON.parse(i)
    );

    delete query.max;
    delete query.min;

    const detail: ChangeFiltersEventDetail = { min, max, route, values };

    const changeFiltersEvent = new CustomEvent(CHANGE_FILTERS_EVENT_NAME, {
      detail
    });
    dispatchEvent(changeFiltersEvent);
  }

  useEffect(() => {
    setPriceFilter({ min: minPrice, max: maxPrice });
  }, [minPrice, maxPrice]);

  return (
    <>
      <div className="px-3.5 py-2 lg:pt-0 lg:mb-3">
        <p>{langVariant("Ціна", "Цена")}</p>
        <ReactSlider
          min={minPrice}
          max={maxPrice}
          className="bg-grey-200 rounded-full h-2 flex items-center my-2"
          value={[priceFilter.min, priceFilter.max]}
          renderThumb={props => (
            <div
              {...props}
              className="w-5 h-5 bg-grey-100 rounded-full box-shadow cursor-move"
            />
          )}
          onChange={rangeHandler}
          pearling
          minDistance={10}
        />
        <div className="flex justify-between">
          <div className="w-12 lg:w-16">
            <Input
              underline
              placeholder={langVariant("Ціна", "Цена")}
              value={priceFilter.min ?? ""}
              type="number"
              onChange={priceInputHanlder("min")}
            />
          </div>
          <div className="w-12 lg:w-16">
            <Input
              underline
              placeholder={langVariant("Ціна", "Цена")}
              value={priceFilter.max ?? ""}
              type="number"
              onChange={priceInputHanlder("max")}
            />
          </div>
        </div>
      </div>
      <div className="overflow-y-auto flex-1 lg:space-y-3 lg:mb-3">
        {characteristics.map(c => (
          <ContentWrapper text={langVariant(c.name.ua, c.name.ru)} key={c._id}>
            <ul className="px-3.5 my-1">
              {c.values.map((v, index) => (
                <li key={v + c._id}>
                  <input
                    className="mr-1"
                    onChange={applyCharacteristic}
                    id={(c._id as string) + index}
                    type="checkbox"
                    name={c._id}
                    value={JSON.stringify({ id: c._id, valueIndex: index })}
                  />
                  <label htmlFor={(c._id as string) + index}>{v}</label>
                </li>
              ))}
            </ul>
          </ContentWrapper>
        ))}
      </div>
      <Button variant="lg" onClick={submitCharacteristics}>
        {langVariant("Підтвердити", "Подтвердить")}
      </Button>
    </>
  );
};

export default Filters;
