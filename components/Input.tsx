import type { FC, InputHTMLAttributes } from "react";

interface CustomInputAttributes {
  error?: boolean;
  type?: "text" | "password" | "search";
}

type Props = InputHTMLAttributes<any> & CustomInputAttributes;

const Input: FC<Props> = ({ error, ...attributes }) => {
  const borderStyle = error
    ? "border-red focus-within:border-red"
    : "border-grey-200 focus-within:border-grey-500";

  return (
    <div
      className={`font-regular border-b-2 py-1 w-full transition-colors ${borderStyle}`}
    >
      <input
        {...attributes}
        className="outline-none placeholder-grey-600 text-grey-400 w-full"
      />
    </div>
  );
};

Input.defaultProps = {
  placeholder: "Текст",
  type: "text",
  error: false
};

export default Input;
