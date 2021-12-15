import { FC } from "react";
import ArrowIcon from "public/img/arrow.svg";

const Tab: FC<{ onClick: () => void; showIcon?: boolean; name: string }> = ({
  onClick,
  showIcon,
  name
}) => {
  return (
    <button className="flex py-3 px-5 items-center w-full" onClick={onClick}>
      <span className="mr-5 text-xs">icon</span>
      <p className="flex-1 text-left text-base">{name}</p>
      {showIcon && (
        <span className="text-grey-400 transform rotate-180 w-2">
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
