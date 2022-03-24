import { ChangeEventHandler, Dispatch, FC, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";

import Input from "components/Input";
import { RootStore } from "store";
import { CheckoutStateKeys } from "types/checkout";
import { CheckoutActions } from "types/checkout-reducer";
import Validation from "utils/Validation";

interface Props {
  error: boolean;
  placeholder: string;
  name: CheckoutStateKeys;
  errorMessage: string;
}

const CheckoutInput: FC<Props> = ({
  error,
  placeholder,
  name,
  errorMessage
}) => {
  const dispatch = useDispatch<Dispatch<CheckoutActions>>();
  const value = useSelector<RootStore>(store => store.checkout[name]) as string;
  const errorMessageStyle = error ? "inline" : "hidden";

  const changeHanlder: ChangeEventHandler<any> = e => {
    if (Validation.isKeyOfCheckoutData(name)) {
      const { value } = e.target;
      dispatch({ type: "checkout/changeField", payload: { name, value } });
    }
  };

  const memoizedChangeHandler = useCallback(changeHanlder, [dispatch, name]);

  return (
    <div>
      <Input
        underline
        name={name}
        placeholder={placeholder}
        error={error}
        value={value}
        onChange={memoizedChangeHandler}
      />
      <b className={"text-red text-sm " + errorMessageStyle}>{errorMessage}</b>
    </div>
  );
};
export default CheckoutInput;
