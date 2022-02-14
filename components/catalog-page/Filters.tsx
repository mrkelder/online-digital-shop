import { ChangeEvent, ChangeEventHandler, FC, useRef, useState } from "react";
import ContentWrapper from "components/ContentWrapper";
import type { CharacteristicQuery } from "utils/fetchCatalog";
import Button from "components/Button";
import ReactSlider from "react-slider";
import Input from "components/Input";
import { useRouter } from "next/router";

// FIXME: DRY
interface ChangeFiltersEventDetail {
  min: number;
  max: number;
  route: string;
  values: ReadonlyArray<CharacteristicQuery>;
}

type PriceFilterField = "min" | "max";

interface Props {
  queryPrice: { min: number; max: number };
  maxPrice: number;
  minPrice: number;
  characteristics: Characteristic[];
  filterEventName: string;
}

const Filters: FC<Props> = ({
  queryPrice,
  minPrice,
  maxPrice,
  characteristics,
  filterEventName
}) => {
  const router = useRouter();
  const characteristicsQuery = useRef<Set<string>>(new Set());
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

    const changeFiltersEvent = new CustomEvent(filterEventName, {
      detail
    });
    dispatchEvent(changeFiltersEvent);
  }

  return (
    <>
      <div className="px-3.5 py-2 lg:pt-0 lg:mb-3">
        <p>Цена</p>
        <ReactSlider
          min={minPrice}
          max={maxPrice}
          className="bg-grey-200 rounded-full h-2 flex items-center my-2"
          value={[priceFilter.min, priceFilter.max]}
          renderThumb={props => (
            <div
              {...props}
              className="w-5 h-5 bg-grey-100 rounded-full box-shadow"
            />
          )}
          onChange={rangeHandler}
          pearling
          minDistance={10}
        />
        <div className="flex justify-between">
          <div className="w-12">
            <Input
              underline
              placeholder="Цена"
              value={priceFilter.min}
              type="number"
              onChange={priceInputHanlder("min")}
            />
          </div>
          <div className="w-12">
            <Input
              underline
              placeholder="Цена"
              value={priceFilter.max}
              type="number"
              onChange={priceInputHanlder("max")}
            />
          </div>
        </div>
      </div>
      <div className="overflow-y-auto flex-1 lg:space-y-3 lg:mb-3">
        {characteristics.map(c => (
          <ContentWrapper text={c.name} key={c.id}>
            <ul className="px-3.5 my-1">
              {c.values.map((v, index) => (
                <li key={v + c.id}>
                  <input
                    className="mr-1"
                    onChange={applyCharacteristic}
                    id={c.id + index}
                    type="checkbox"
                    name={c.id}
                    value={JSON.stringify({ id: c.id, valueIndex: index })}
                  />
                  <label htmlFor={c.id + index}>{v}</label>
                </li>
              ))}
            </ul>
          </ContentWrapper>
        ))}
      </div>
      <Button variant="lg" onClick={submitCharacteristics}>
        Подтвердить
      </Button>
    </>
  );
};

export default Filters;
