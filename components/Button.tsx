import { FC } from "react";

interface Props {
  color?: "grey" | "red";
  variant?: "sm" | "lg";
  onClick?: () => void;
}

const Button: FC<Props> = ({ children, variant, color, onClick }) => {
  const colorStyle = color === "grey" ? "grey-400" : "red";
  const sizeStyle =
    variant === "sm"
      ? "text-sm p-2 text-center lg:text-base"
      : "text-lg p-3 text-center lg:text-xl";

  return (
    <button
      {...{ onClick }}
      className={`text-white font-light w-full bg-${colorStyle} ${sizeStyle}`}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  color: "red",
  variant: "sm",
  onClick: undefined
};

export default Button;
