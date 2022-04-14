import { FC, MouseEventHandler, useEffect, useState } from "react";

import {
  useStripe,
  useElements,
  PaymentElement
} from "@stripe/react-stripe-js";

import Button from "components/Button";
import LoadingSpinner from "components/LoadingSpinner";
import { CheckoutFormData } from "types/checkout";

interface Props {
  swtichToSecondStage: () => void;
  clientSecret: string;
  clientInfo: CheckoutFormData;
  isFormValid: boolean;
}

const CheckoutForm: FC<Props> = ({
  swtichToSecondStage,
  clientSecret,
  clientInfo,
  isFormValid
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [isStripeUIIsLoaded, setIsStripeUIIsLoaded] = useState(false);
  const [isPaymentSent, setIsPaymentSent] = useState(false);

  const isStripeLoaded = !!stripe && elements;
  const isFormTotallyReady = (!!stripe && isFormValid) || isPaymentSent;
  const stripeFormVisibilityStyling = isStripeUIIsLoaded ? "block" : "hidden";

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async e => {
    e.preventDefault();

    if (!isStripeLoaded) {
      return;
    }

    const { city, fullName, email, street, apartment, house } = clientInfo;
    setIsPaymentSent(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url:
          (process.env.NEXT_PUBLIC_HOSTNAME as string) + "/successfulPayment",
        receipt_email: email,
        shipping: {
          name: fullName,
          address: {
            city: city,
            country: "UA",
            line1: `${city}, ${street}, ${house}, ${apartment}`
          }
        }
      }
    });

    if (error) {
      setErrorMessage(error.message as string);
      setIsPaymentSent(false);
    }
  };

  function copyClientSecretToClipboard() {
    navigator.clipboard.writeText(clientSecret);
  }

  useEffect(() => {
    function handleStripeLoad() {
      setIsStripeUIIsLoaded(true);
    }

    function handleFormChange() {
      setErrorMessage(null);
    }

    if (elements) {
      elements.getElement("payment")?.once("ready", handleStripeLoad);
      elements.getElement("payment")?.on("change", handleFormChange);
    }

    return () => {
      if (elements) {
        elements.getElement("payment")?.off("change", handleFormChange);
      }
    };
  }, [elements]);

  return (
    <>
      {isStripeUIIsLoaded && (
        <div className="flex mb-3 items-center">
          <div className="flex-1 overflow-hidden">
            <p className="text-sm">Id вашего заказа:</p>
            <p className="text-sm font-bold overflow-x-auto">{clientSecret}</p>
          </div>
          <button
            type="button"
            className="text-sm underline w-min ml-10"
            onClick={copyClientSecretToClipboard}
          >
            Скопировать
          </button>
        </div>
      )}

      <div className={stripeFormVisibilityStyling}>
        <PaymentElement />
      </div>

      {errorMessage && <p className="text-red mt-2">{errorMessage}</p>}

      {isStripeUIIsLoaded ? (
        <>
          <p className="text-sm my-2 text-grey-400">
            Внимание! В случае, если оплата пройдет неуспешно, а средства будут
            списаны, обратитесь в поддержку, предоставив код, указанный выше -
            это ускорит возврат средств.
          </p>

          <div className="flex justify-between">
            <div className="w-24 sm:w-36">
              <Button
                loading={isPaymentSent}
                disabled={isFormTotallyReady}
                onClick={handleSubmit}
              >
                Продолжить
              </Button>
            </div>
            <div className="w-24 sm:w-36">
              <Button onClick={swtichToSecondStage} color="grey">
                Назад
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <span>Загрузка формы</span>
          <LoadingSpinner size={15} />
        </div>
      )}
    </>
  );
};

export default CheckoutForm;
