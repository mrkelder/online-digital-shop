import { FC } from "react";

import Image from "next/image";

import useLanguage from "hooks/useLanguage";
import ArrowIcon from "public/img/arrow.svg";

interface Props {
  onClick: () => void;
  onMouseEnter?: () => void;
  showIcon?: boolean;
  icon?: string;
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
  tabIndex,
  icon
}) => {
  const { langVariant } = useLanguage();
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
      {icon && (
        <div className="w-5 h-5 mr-3 relative">
          <Image
            src={process.env.NEXT_PUBLIC_STATIC_HOST + icon}
            layout="fill"
            alt={langVariant("Іконка", "Иконка")}
            objectFit="contain"
            objectPosition="50%"
          />
        </div>
      )}
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
