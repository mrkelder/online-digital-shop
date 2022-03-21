import { FC } from "react";

import LoadingIcon from "public/img/loading.svg";

interface Props {
  size?: number;
  color?: string;
}

const LoadingSpinner: FC<Props> = ({ size, color }) => {
  const sizeInPixels = size + "px";
  const colorStyling = `text-${color}`;

  return (
    <span
      className={`flex animate-spin ${colorStyling}`}
      style={{ width: sizeInPixels, height: sizeInPixels }}
    >
      <LoadingIcon />
    </span>
  );
};

LoadingSpinner.defaultProps = {
  size: 14,
  color: "red"
};

export default LoadingSpinner;
