import { DOMAttributes, FC } from "react";

import LoadingSpinner from "./LoadingSpinner";

interface Props {
  color?: "grey" | "red";
  variant?: "sm" | "lg";
  type?: "button" | "submit";
  onClick?: DOMAttributes<HTMLButtonElement>["onClick"];
  disabled?: boolean;
  loading?: boolean;
}

const Button: FC<Props> = ({
  children,
  variant,
  color,
  onClick,
  disabled,
  type,
  loading
}) => {
  const initialColorStyle =
    color === "grey"
      ? "bg-grey-300 hover:bg-grey-400"
      : "bg-red hover:bg-red-focus";
  const colorStyle = disabled ? "bg-grey-200" : initialColorStyle;
  const sizeStyle =
    variant === "sm"
      ? "text-sm p-2 text-center lg:text-base"
      : "text-lg p-3 text-center lg:text-xl";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`flex items-center justify-center text-white font-light w-full ${colorStyle} ${sizeStyle} transition-colors`}
    >
      {loading ? <LoadingSpinner color="white" size={20} /> : children}
    </button>
  );
};

Button.defaultProps = {
  color: "red",
  variant: "sm",
  type: "button",
  onClick: undefined,
  disabled: false,
  loading: false
};

export default Button;
