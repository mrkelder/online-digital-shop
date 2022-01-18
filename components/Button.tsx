import { FC } from "react";

interface Props {
  color?: "grey" | "red";
  variant?: "sm" | "lg";
  onClick?: () => void;
  disabled?: boolean;
}

const Button: FC<Props> = ({ children, variant, color, onClick, disabled }) => {
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
      className={`text-white font-light w-full ${colorStyle} ${sizeStyle} transition-colors`}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  color: "red",
  variant: "sm",
  onClick: undefined,
  disabled: false
};

export default Button;
