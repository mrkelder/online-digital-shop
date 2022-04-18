import { FC } from "react";

import useLanguage from "hooks/useLanguage";
import ArrowIcon from "public/img/arrow.svg";

interface Props {
  onClick: () => void;
  shopObj: Shop;
  isSelected: boolean;
}

const Shop: FC<Props> = ({ onClick, shopObj, isSelected }) => {
  const { langVariant } = useLanguage();
  const day = new Date().getDay();
  const today = shopObj.schedule[day];
  const arrowStyle = isSelected ? "-rotate-90" : "rotate-90";
  const buttonStyle = isSelected ? "bg-grey-100" : "bg-white";
  const timetableStyle = isSelected ? "flex" : "hidden";

  const [lat, lng] = shopObj.geo.map(i => i.toString());

  function getDayName(day: number, isMeta = false) {
    switch (day) {
      case 0:
        return isMeta ? "Su" : langVariant("Неділя", "Воскресенье");
      case 1:
        return isMeta ? "Mo" : langVariant("Понеділок", "Понедельник");
      case 2:
        return isMeta ? "Tu" : langVariant("Вівторок", "Вторник");
      case 3:
        return isMeta ? "We" : langVariant("Середа", "Среда");
      case 4:
        return isMeta ? "Th" : langVariant("Четвер", "Четверг");
      case 5:
        return isMeta ? "Fr" : langVariant("П'ятниця", "Пятница");
      case 6:
        return isMeta ? "Sa" : langVariant("Субота", "Суббота");
      default:
        throw new Error();
    }
  }

  return (
    <button
      {...{ onClick }}
      className={"flex flex-col px-4 py-2 w-full " + buttonStyle}
      itemScope
      itemType="https://schema.org/Store"
    >
      <meta itemProp="currenciesAccepted" content="UAH" />
      <meta itemProp="priceRange" content="$$" />
      <div itemProp="geo">
        <meta itemProp="latitude" content={lat} />
        <meta itemProp="longitude" content={lng} />
      </div>

      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col items-start w-4/5">
          <p
            className="mb-1 text-grey-600 font-regular text-lg w-full text-left"
            itemProp="name"
          >
            {langVariant(shopObj.name.ua, shopObj.name.ru)}
          </p>
          {!isSelected && (
            <strong className="text-sm font-light text-grey-300 font-normal">
              {today ? (
                <>
                  Сегодня с <time dateTime={today?.from}>{today?.from}</time> по{" "}
                  <time dateTime={today?.to}>{today?.to}</time>
                </>
              ) : (
                langVariant("Сьогодні вихідний", "Сегодня выходной")
              )}
            </strong>
          )}
        </div>
        <span className={"w-2 text-grey-300 mr-4 transform " + arrowStyle}>
          <ArrowIcon />
        </span>
      </div>
      <div
        className={
          "flex-col items-start w-48 mb-2 lg:w-full lg:mt-2 " + timetableStyle
        }
      >
        {shopObj.schedule.map((i, index) => (
          <div
            key={`day_${index}`}
            className={`flex w-full justify-between font-regular h-5 text-grey-${
              day === index ? "600 font-bold" : "300"
            }`}
          >
            <span className="text-sm">{getDayName(index)}</span>
            <span className="text-sm">
              {" "}
              {i ? (
                <>
                  <time dateTime={i?.from}>{i?.from}</time> -{" "}
                  <time dateTime={today?.to}>{i?.to}</time>
                  <meta
                    itemProp="openingHours"
                    content={`${getDayName(index, true)}, ${i?.from}-${i?.to}`}
                  />
                </>
              ) : (
                <>
                  {langVariant("вихідний", "выходной")}
                  <meta
                    itemProp="openingHours"
                    content={`${getDayName(index, true)}, Weekend`}
                  />
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </button>
  );
};

export default Shop;
