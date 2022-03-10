import {
  ChangeEvent,
  Dispatch,
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import Button from "components/Button";
import CheckoutInput from "components/checkout-page/CheckoutInput";
import StageWrapper from "components/checkout-page/StageWrapper";
import MetaHead from "components/meta/MetaHead";
import FailureIcon from "public/img/failure.svg";
import LoadingIcon from "public/img/loading.svg";
import SuccessIcon from "public/img/success.svg";
import { RootStore } from "store";
import { CartActions } from "store/cartReducer";
import Cookie from "utils/cookie/cookie";
import { AMOUNT_OF_ITEMS_IN_CART } from "utils/cookie/cookieNames";
import {
  CheckotInfo,
  FormData,
  validateFormData
} from "utils/validation/checkout";

interface PaymentInfo {
  paymentSent: boolean;
  paymentSuccess: boolean | "none";
}

type CheckoutStages = 1 | 2 | 3;

const DEFAULT_VALIDATION: CheckotInfo = {
  fullName: false,
  city: false,
  email: false,
  street: false,
  house: false,
  apartment: false
};

const DEFAULT_FORM_DATA: FormData = {
  fullName: "",
  city: "",
  email: "",
  apartment: "",
  house: "",
  street: ""
};

const DEFAULT_PAYMENT_INFO: PaymentInfo = {
  paymentSent: false,
  paymentSuccess: "none"
};

const FIRST_STAGE = 1;
const SECOND_STAGE = 2;
const THIRD_STAGE = 3;

const RESULT_STYLE = "flex flex-col items-center space-y-2";
const TITLE = "Оплата";

const cookie = new Cookie();

const CheckoutPage: NextPage = () => {
  const router = useRouter();
  const itemsQuantity = useSelector<RootStore>(
    store => store.cart.items.length
  ) as number;
  const dispatch = useDispatch<Dispatch<CartActions>>();
  const [validationErrors, setValidationErrors] = useState(DEFAULT_VALIDATION);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [paymentInfo, setPaymentInfo] = useState(DEFAULT_PAYMENT_INFO);
  const [loadedLocalStorage, setLoadedLocalStorage] = useState(false);
  // TODO: create a separeate hook
  const [currentStage, setCurrentStage] = useState<CheckoutStages>(FIRST_STAGE);

  const { paymentSent, paymentSuccess } = paymentInfo;

  let formStyle = "grid";
  let paymentResultStyle = "hidden";
  let paymentLoadingStyle = "hidden";
  let paymentSuccessStyle = "hidden";
  let paymentFailureStyle = "hidden";

  if (paymentSent) {
    formStyle = "hidden";
    paymentResultStyle = "block";
    paymentLoadingStyle = paymentSuccess === "none" ? RESULT_STYLE : "hidden";
    paymentSuccessStyle = paymentSuccess === true ? RESULT_STYLE : "hidden";
    paymentFailureStyle = paymentSuccess === false ? RESULT_STYLE : "hidden";
  }

  const switchStage = useCallback((newStage: CheckoutStages) => {
    return () => {
      setCurrentStage(newStage);
    };
  }, []);

  const submitCheckout: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    if (currentStage === THIRD_STAGE) {
      const validation = validateFormData(formData);

      if (validation && !loadedLocalStorage) {
        const newValidationErrors = { ...validationErrors };
        const arrayOfValidationItems = Object.entries(validation);

        for (const [field, value] of arrayOfValidationItems) {
          newValidationErrors[field] = value;
        }

        setValidationErrors(newValidationErrors);
      } else {
        setPaymentInfo({ paymentSuccess: "none", paymentSent: true });
        setTimeout(() => {
          dispatch({ type: "cart/restore" });
          setPaymentInfo({ paymentSent: true, paymentSuccess: true });
        }, 3000);
      }
    }
  };

  function firstStageFormHandler() {
    const validation = validateFormData(formData);

    if (validation.fullName || validation.email) {
      const newValidationErrors = { ...validationErrors };
      const arrayOfValidationItems = Object.entries(validation);

      for (const [field, value] of arrayOfValidationItems) {
        newValidationErrors[field] = value;
      }
      setValidationErrors(newValidationErrors);
    } else {
      switchStage(2)();
    }
  }

  function secondStageFormHandler() {
    const validation = validateFormData(formData);
    const { city, street, house, apartment } = validation;

    if (city || street || house || apartment) {
      const newValidationErrors = { ...validationErrors };
      const arrayOfValidationItems = Object.entries(validation);

      for (const [field, value] of arrayOfValidationItems) {
        newValidationErrors[field] = value;
      }
      setValidationErrors(newValidationErrors);
    } else {
      switchStage(3)();
    }
  }

  function formChange(e: ChangeEvent<HTMLFormElement>) {
    const { name, value } = e.target;
    const newFormState = { ...formData };
    newFormState[name as keyof FormData] = value;
    setFormData(newFormState);
    setValidationErrors(DEFAULT_VALIDATION);
  }

  useEffect(() => {
    const cookieAmountOfItemsInCart = Number(
      cookie.readCookie(AMOUNT_OF_ITEMS_IN_CART)
    );

    const cookieIsNaN = isNaN(cookieAmountOfItemsInCart);
    const cookieAndLocalStorageAreNotEqual =
      cookieAmountOfItemsInCart !== itemsQuantity;

    const shouldBeRedirected = cookieIsNaN || cookieAndLocalStorageAreNotEqual;
    const decision = loadedLocalStorage && shouldBeRedirected;

    if (decision) router.push("/");
    else setLoadedLocalStorage(true);
  }, [itemsQuantity, router, loadedLocalStorage]);

  return (
    <>
      <MetaHead title={TITLE} noindex />
      <h1>{TITLE}</h1>

      <form
        onChange={formChange}
        onSubmit={submitCheckout}
        className="space-y-2"
      >
        <StageWrapper
          title="Данные о покупателе"
          stageNumber={FIRST_STAGE}
          active={currentStage === FIRST_STAGE}
        >
          <div className="space-y-3">
            {useMemo(
              () => (
                <CheckoutInput
                  error={validationErrors.fullName}
                  value={formData.fullName}
                  name="fullName"
                  placeholder="Фамилия Имя"
                  errorMessage="Форма может содержать только русские, английские или украинские символы"
                />
              ),
              [validationErrors.fullName, formData.fullName]
            )}
            {useMemo(
              () => (
                <CheckoutInput
                  error={validationErrors.email}
                  value={formData.email}
                  name="email"
                  placeholder="Почта"
                  errorMessage="Указана неверная почта"
                />
              ),
              [validationErrors.email, formData.email]
            )}
          </div>

          <div className="flex justify-between mt-3">
            <div className="w-24 sm:w-36">
              <Button onClick={firstStageFormHandler}>Продолжить</Button>
            </div>
          </div>
        </StageWrapper>

        <StageWrapper
          title="Место получения"
          stageNumber={SECOND_STAGE}
          active={currentStage === SECOND_STAGE}
        >
          <div className="grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-2 md:gap-x-5 md:grid-cols-4">
            {useMemo(
              () => (
                <CheckoutInput
                  name="city"
                  placeholder="Город"
                  error={validationErrors.city}
                  value={formData.city}
                  errorMessage="Город указан неверно"
                />
              ),
              [validationErrors.city, formData.city]
            )}
            {useMemo(
              () => (
                <CheckoutInput
                  name="street"
                  placeholder="Улица"
                  error={validationErrors.street}
                  value={formData.street}
                  errorMessage="Улица указана неверно"
                />
              ),
              [validationErrors.street, formData.street]
            )}
            {useMemo(
              () => (
                <CheckoutInput
                  name="house"
                  placeholder="Дом"
                  error={validationErrors.house}
                  value={formData.house}
                  errorMessage="Дом указан неверно"
                />
              ),
              [validationErrors.house, formData.house]
            )}
            {useMemo(
              () => (
                <CheckoutInput
                  name="apartment"
                  placeholder="Квартира"
                  error={validationErrors.apartment}
                  value={formData.apartment}
                  errorMessage="Квартира указана неверно"
                />
              ),
              [validationErrors.apartment, formData.apartment]
            )}
          </div>

          <div className="flex justify-between mt-3">
            <div className="w-24 sm:w-36">
              <Button onClick={secondStageFormHandler}>Продолжить</Button>
            </div>
            <div className="w-24 sm:w-36">
              <Button onClick={switchStage(1)} color="grey">
                Назад
              </Button>
            </div>
          </div>
        </StageWrapper>

        <StageWrapper
          title="Оплата"
          stageNumber={THIRD_STAGE}
          active={currentStage === THIRD_STAGE}
        >
          {/* Placeholder for Stripe */}

          <div className="flex justify-between mt-3">
            <div className="w-24 sm:w-36">
              <Button disabled>Продолжить</Button>
            </div>
            <div className="w-24 sm:w-36">
              <Button onClick={switchStage(2)} color="grey">
                Назад
              </Button>
            </div>
          </div>
        </StageWrapper>
      </form>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  function deleteCookieAndReturnRedirect(
    res: GetServerSidePropsContext["res"]
  ) {
    res.setHeader(
      "Set-Cookie",
      cookie.returnDeleteCookieConf(AMOUNT_OF_ITEMS_IN_CART)
    );

    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }

  try {
    const cookie = context.req.cookies[AMOUNT_OF_ITEMS_IN_CART];
    const parsedCookie = Number(cookie);

    if (!isNaN(parsedCookie) && parsedCookie > 0) {
      return {
        props: { ok: true }
      };
    } else {
      return deleteCookieAndReturnRedirect(context.res);
    }
  } catch {
    return deleteCookieAndReturnRedirect(context.res);
  }
};

export default CheckoutPage;
