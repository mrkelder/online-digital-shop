import type { FC, InputHTMLAttributes } from "react";

interface CustomInputAttributes {
  error?: boolean;
  type?: "text" | "password" | "search" | "email" | "number";
  underline?: boolean;
  borderClass?: string;
  paddingClass?: string;
}

type Props = InputHTMLAttributes<any> & CustomInputAttributes;

const Input: FC<Props> = ({
  error,
  underline,
  borderClass,
  paddingClass,
  ...attributes
}) => {
  let borderStyle = borderClass as string;
  let inputStyle = `${paddingClass} ${error ? "text-red" : "text-grey-400"}`;

  if (underline) {
    borderStyle = `border-b-2 transition-colors py-1 ${
      error
        ? "border-red focus-within:border-red"
        : "border-grey-200 focus-within:border-grey-500"
    }`;
    inputStyle = "bg-transparent";
  }

  return (
    <div className={`font-regular w-full ${borderStyle}`}>
      <input
        {...attributes}
        className={`outline-none placeholder-grey-600 text-grey-400 w-full ${inputStyle}`}
      />
    </div>
  );
};

Input.defaultProps = {
  placeholder: "Текст",
  type: "text",
  error: false,
  underline: false,
  borderClass: "border border-transparent",
  paddingClass: "px-2 py-2"
};

export default Input;
