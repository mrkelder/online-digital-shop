import { FC } from "react";

import Input from "components/Input";
import { CheckoutValidationFields } from "utils/validation/checkoutValidation";

interface Props {
  error: boolean;
  value: string;
  placeholder: string;
  name: CheckoutValidationFields;
  errorMessage: string;
}

const CheckoutInput: FC<Props> = ({
  error,
  value,
  placeholder,
  name,
  errorMessage
}) => {
  const errorMessageStyle = error ? "inline" : "hidden";
  return (
    <div>
      <Input
        underline
        name={name}
        placeholder={placeholder}
        error={error}
        defaultValue={value}
      />
      <b className={"text-red text-sm " + errorMessageStyle}>{errorMessage}</b>
    </div>
  );
};
export default CheckoutInput;
