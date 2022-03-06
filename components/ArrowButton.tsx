import { FC } from "react";

import ArrowIcon from "public/img/arrow.svg";

interface Props {
  side?: "left" | "right";
  size?: number;
  arrowIconSize?: number;
  buttonClassName: string;
}

const ArrowButton: FC<Props> = ({
  side,
  size,
  buttonClassName,
  arrowIconSize
}) => {
  const rotationStyling = side === "left" ? "rotate-0" : "rotate-180";

  return (
    <button
      className={`${buttonClassName} transform ${rotationStyling} w-${size} h-${size} ${side}-0 flex absolute z-10 items-center justify-center bg-white box-shadow rounded-full`}
    >
      <span className={`w-${arrowIconSize} text-grey-300`}>
        <ArrowIcon />
      </span>
    </button>
  );
};

ArrowButton.defaultProps = {
  side: "left",
  size: 12,
  arrowIconSize: 2,
  buttonClassName: ""
};

export default ArrowButton;
