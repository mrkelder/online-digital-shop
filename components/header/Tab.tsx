import { FC } from "react";
import ArrowIcon from "public/img/arrow.svg";

interface Props {
  onClick: () => void;
  onMouseEnter?: () => void;
  showIcon?: boolean;
  name: string;
  focused?: boolean;
  tabIndex?: number;
}

const Tab: FC<Props> = ({
  onClick,
  showIcon,
  name,
  focused,
  onMouseEnter,
  tabIndex
}) => {
  const background = focused ? "bg-grey-75" : "bg-white focus:bg-grey-75";
  return (
    <button
      className={
        "flex py-3 px-5 items-center w-full transition-colors " + background
      }
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      tabIndex={tabIndex}
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
  name: "Текст",
  tabIndex: -1
};

export default Tab;
