import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";

import Button from "components/Button";
import CheckoutForm from "components/checkout-page/CheckoutForm";
import CheckoutInput from "components/checkout-page/CheckoutInput";
import StageWrapper from "components/checkout-page/StageWrapper";
import LoadingSpinner from "components/LoadingSpinner";
import MetaHead from "components/meta/MetaHead";
import {
  THIRD_STAGE,
  FIRST_STAGE,
  SECOND_STAGE
} from "constants/checkout-stages";
import { AMOUNT_OF_ITEMS_IN_CART } from "constants/cookie-names";
import useLanguage from "hooks/useLanguage";
import useMatchMedia from "hooks/useMatchMedia";
import { CreatePaymentIntentResponse } from "types/api";
import { ReduxCartProduct } from "types/cart-reducer";
import {
  CheckoutValidationData,
  CheckoutFields,
  CheckoutStages,
  CheckoutState,
  CheckoutStateKeys
} from "types/checkout";
import { CheckoutActions } from "types/checkout-reducer";
import type { RootStore } from "types/store";
import Cookie from "utils/Cookie";
import Validation from "utils/Validation";

// Submition of the payment and form in general is in CheckoutForm component

const DEFAULT_VALIDATION: CheckoutValidationData = {
  fullName: false,
  city: false,
  email: false,
  street: false,
  house: false,
  apartment: false
};

const TITLE = "Оплата";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const CheckoutPage: NextPage = () => {
  const router = useRouter();
  const { langVariant } = useLanguage();
  const dispatch = useDispatch<Dispatch<CheckoutActions>>();
  const cartItems = useSelector<RootStore>(
    store => store.cart.items
  ) as ReduxCartProduct[];
  const formData = useSelector<RootStore>(
    store => store.checkout
  ) as CheckoutState;
  const { isLoaded } = useMatchMedia();
  const [validationErrors, setValidationErrors] = useState(DEFAULT_VALIDATION);
  const [isStripeFetchSuccessful, setIsStripeFetchSuccessful] = useState(true);

  const { currentStage } = formData;
  const stripeClientSecret = formData.stripeClientId;

  const options: StripeElementsOptions = {
    clientSecret: stripeClientSecret
  };

  const switchStage = useCallback(
    (newStage: CheckoutStages) => {
      return () => {
        dispatch({
          type: "checkout/changeField",
          payload: { name: "currentStage", value: newStage }
        });
      };
    },
    [dispatch]
  );

  function checkValidation(): CheckoutValidationData {
    const validation = Validation.checkoutFormData(formData);

    const newValidationErrors = { ...validationErrors };
    const arrayOfValidationItems = Object.entries(validation);

    for (const [field, value] of arrayOfValidationItems) {
      newValidationErrors[field as CheckoutFields] = value;
    }

    return newValidationErrors;
  }

  function checkTotalValidation(): boolean {
    const validationResult = checkValidation();

    const isThereAnyError =
      Object.values(validationResult).indexOf(true) !== -1;

    return isThereAnyError;
  }

  function firstStageFormHandler() {
    const validationResult = checkValidation();
    const { fullName, email } = validationResult;

    if (!fullName && !email) {
      setValidationErrors(DEFAULT_VALIDATION);
      switchStage(2)();
    } else {
      setValidationErrors(validationResult);
    }
  }

  function secondStageFormHandler() {
    const validationResult = checkValidation();
    const { city, street, house, apartment } = validationResult;

    if (!city && !street && !house && !apartment) {
      switchStage(3)();
    } else {
      setValidationErrors(validationResult);
    }
  }

  function formChange(e: ChangeEvent<HTMLFormElement>) {
    const { name, value } = e.target;

    if (Validation.isKeyOfCheckoutData(name)) {
      dispatch({
        type: "checkout/changeField",
        payload: {
          name: name as CheckoutStateKeys,
          value
        }
      });
      setValidationErrors(DEFAULT_VALIDATION);
    }
  }

  function resetCheckoutData() {
    dispatch({ type: "checkout/restore" });
    setValidationErrors(DEFAULT_VALIDATION);
    switchStage(1)();
  }

  useEffect(() => {
    const cookieAmountOfItemsInCart = Number(
      Cookie.readCookie(AMOUNT_OF_ITEMS_IN_CART)
    );

    const cookieIsNaN = isNaN(cookieAmountOfItemsInCart);
    const cookieAndLocalStorageAreNotEqual =
      cookieAmountOfItemsInCart !== cartItems.length;

    const shouldBeRedirected = cookieIsNaN || cookieAndLocalStorageAreNotEqual;
    const decision = isLoaded && shouldBeRedirected;

    if (decision) router.push("/");
  }, [cartItems, router, isLoaded]);

  useEffect(() => {
    async function fetchClientSecret() {
      const endpoint =
        process.env.NEXT_PUBLIC_HOSTNAME + "/api/createPaymentIntent";
      const body = JSON.stringify(
        cartItems.map(i => ({ _id: i._id, quantity: i.quantity }))
      );

      const result = await fetch(endpoint, {
        method: "POST",
        body
      });

      if (!result.ok || !result) {
        setIsStripeFetchSuccessful(false);
        console.error(
          "Checkout page: stripe payment intent has not been retrieved successfully"
        );
      }

      const data: CreatePaymentIntentResponse = await result.json();
      dispatch({
        type: "checkout/changeField",
        payload: { name: "stripeClientId", value: data.secret as string }
      });
    }

    if (currentStage === THIRD_STAGE && stripeClientSecret === undefined) {
      fetchClientSecret();
    }
  }, [currentStage, stripeClientSecret, dispatch, cartItems]);

  return (
    <>
      <MetaHead title={TITLE} noindex />
      <h1>{TITLE}</h1>

      <button onClick={resetCheckoutData} className="mb-2 underline">
        {langVariant("Скинути форму", "Сбросить форму")}
      </button>

      <form onChange={formChange} className="space-y-2">
        <StageWrapper
          title={langVariant("Дані про покупця", "Данные о покупателе")}
          stageNumber={FIRST_STAGE}
          active={currentStage === FIRST_STAGE}
        >
          <div className="space-y-3">
            {useMemo(
              () => (
                <CheckoutInput
                  error={validationErrors.fullName}
                  name="fullName"
                  placeholder={langVariant("Прізвище Ім'я", "Фамилия Имя")}
                  errorMessage={langVariant(
                    "Вкажіть лише Прізвище та Ім'я. Форма може містити лише російські, англійські чи українські символи",
                    "Укажите только Фамилию и Имя. Форма может содержать только русские, английские или украинские символы"
                  )}
                />
              ),
              [validationErrors.fullName, langVariant]
            )}
            {useMemo(
              () => (
                <CheckoutInput
                  error={validationErrors.email}
                  name="email"
                  placeholder={langVariant("Пошта", "Почта")}
                  errorMessage={langVariant(
                    "Вказана неправильна пошта",
                    "Указана неверная почта"
                  )}
                />
              ),
              [validationErrors.email, langVariant]
            )}
          </div>

          <div className="flex justify-between mt-3">
            <div className="w-24 sm:w-36">
              <Button onClick={firstStageFormHandler}>
                {langVariant("Продовжити", "Продолжить")}
              </Button>
            </div>
          </div>
        </StageWrapper>

        <StageWrapper
          title={langVariant("Місце отримання", "Место получения")}
          stageNumber={SECOND_STAGE}
          active={currentStage === SECOND_STAGE}
        >
          <div className="grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-2 md:gap-x-5 md:grid-cols-4">
            {useMemo(
              () => (
                <CheckoutInput
                  name="city"
                  placeholder={langVariant("Місто", "Город")}
                  error={validationErrors.city}
                  errorMessage={langVariant(
                    "Місто вказано неправильно",
                    "Город указан неверно"
                  )}
                />
              ),
              [validationErrors.city, langVariant]
            )}
            {useMemo(
              () => (
                <CheckoutInput
                  name="street"
                  placeholder={langVariant("Вулиця", "Улица")}
                  error={validationErrors.street}
                  errorMessage={langVariant(
                    "Вулиця вказана неправильно",
                    "Улица указана неверно"
                  )}
                />
              ),
              [validationErrors.street, langVariant]
            )}
            {useMemo(
              () => (
                <CheckoutInput
                  name="house"
                  placeholder={langVariant("Будинок", "Дом")}
                  error={validationErrors.house}
                  errorMessage={langVariant(
                    "Будинок вказано неправильно",
                    "Дом указан неверно"
                  )}
                />
              ),
              [validationErrors.house, langVariant]
            )}
            {useMemo(
              () => (
                <CheckoutInput
                  name="apartment"
                  placeholder="Квартира"
                  error={validationErrors.apartment}
                  errorMessage={langVariant(
                    "Квартира вказана невірно",
                    "Квартира указана неверно"
                  )}
                />
              ),
              [validationErrors.apartment, langVariant]
            )}
          </div>

          <div className="flex justify-between mt-3">
            <div className="w-24 sm:w-36">
              <Button onClick={secondStageFormHandler}>
                {langVariant("Продовжити", "Продолжить")}
              </Button>
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
          {stripeClientSecret === undefined ? (
            <div className="flex items-center justify-center space-x-2">
              <span>
                {isStripeFetchSuccessful
                  ? langVariant("Створення замовлення", "Создание заказа")
                  : langVariant(
                      "Не вдалося створити замовлення",
                      "Не удалось создать заказ"
                    )}
              </span>
              {isStripeFetchSuccessful && <LoadingSpinner size={15} />}
            </div>
          ) : (
            <>
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm
                  swtichToSecondStage={switchStage(2)}
                  clientSecret={stripeClientSecret}
                  isFormValid={checkTotalValidation()}
                  clientInfo={formData}
                />
              </Elements>
            </>
          )}
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
      Cookie.returnDeleteCookieConf(AMOUNT_OF_ITEMS_IN_CART)
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
