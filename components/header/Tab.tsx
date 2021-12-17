import { FC } from "react";
import ArrowIcon from "public/img/arrow.svg";

const Tab: FC<{
  onClick: () => void;
  showIcon?: boolean;
  name: string;
  focused?: boolean;
}> = ({ onClick, showIcon, name, focused }) => {
  const background = focused
    ? "bg-grey-75"
    : "bg-white hover:bg-grey-75 focus:bg-grey-75";
  return (
    <button
      className={
        "flex py-3 px-5 items-center w-full transition-colors " + background
      }
      onClick={onClick}
    >
      <span className="mr-5 text-xs">icon</span>
      <p className="flex-1 text-left text-base lg:text-xl lg:font-light">
        {name}
      </p>
      {showIcon && (
        <span className="text-grey-400 transform rotate-180 w-2 lg:w-1.5">
          <ArrowIcon />
        </span>
      )}
    </button>
  );
};

Tab.defaultProps = {
  name: "Текст"
};

export default Tab;
