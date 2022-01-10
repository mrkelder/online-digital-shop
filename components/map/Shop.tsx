import { FC } from "react";
import ArrowIcon from "public/img/arrow.svg";

interface Props {
  onClick: () => void;
  shopObj: Shop;
  isSelected: boolean;
}

function getDayName(day: number) {
  switch (day) {
    case 0:
      return "Воскресенье";
    case 1:
      return "Понедельник";
    case 2:
      return "Вторник";
    case 3:
      return "Среда";
    case 4:
      return "Четверг";
    case 5:
      return "Пятница";
    case 6:
      return "Суббота";
    default:
      throw new Error();
  }
}

const Shop: FC<Props> = ({ onClick, shopObj, isSelected }) => {
  const day = new Date().getDay();
  const today = shopObj.schedule[day];
  const arrowStyle = isSelected ? "-rotate-90" : "rotate-90";
  const buttonStyle = isSelected ? "bg-grey-100" : "bg-white";
  const timetableStyle = isSelected ? "flex" : "hidden";

  return (
    <button
      {...{ onClick }}
      className={"flex flex-col px-4 py-2 w-full " + buttonStyle}
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col items-start w-4/5">
          <p className="mb-1 text-grey-600 font-regular text-lg truncate w-full text-left">
            {shopObj.name}
          </p>
          {!isSelected && (
            <strong className="text-sm font-light text-grey-300 font-normal">
              {today ? (
                <>
                  Сегодня с <time dateTime={today?.from}>{today?.from}</time> по{" "}
                  <time dateTime={today?.to}>{today?.to}</time>
                </>
              ) : (
                "Сегодня выходной"
              )}
            </strong>
          )}
        </div>
        <span className={"w-2 text-grey-300 mr-4 transform " + arrowStyle}>
          <ArrowIcon />
        </span>
      </div>
      <div className={"flex-col items-start w-1/2 mb-2 " + timetableStyle}>
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
                  {i?.from} - {i?.to}
                </>
              ) : (
                <>выходной</>
              )}
            </span>
          </div>
        ))}
      </div>
    </button>
  );
};

export default Shop;
