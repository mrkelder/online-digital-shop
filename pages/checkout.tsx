import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import Button from "components/Button";
import CheckoutForm from "components/checkout-page/CheckoutForm";
import CheckoutInput from "components/checkout-page/CheckoutInput";
import StageWrapper from "components/checkout-page/StageWrapper";
import LoadingSpinner from "components/LoadingSpinner";
import MetaHead from "components/meta/MetaHead";
import useMatchMedia from "hooks/useMatchMedia";
import { RootStore } from "store";
import Cookie from "utils/cookie/cookie";
import { AMOUNT_OF_ITEMS_IN_CART } from "utils/cookie/cookieNames";
import {
  CheckoutValidationData,
  CheckoutValidationFields,
  CheckoutFormData,
  validateFormData
} from "utils/validation/checkoutValidation";

import { CreatePaymentIntentResponse } from "./api/createPaymentIntent";

// Submition of the payment and form in general is in CheckoutForm component

type CheckoutStages = 1 | 2 | 3;

const DEFAULT_VALIDATION: CheckoutValidationData = {
  fullName: false,
  city: false,
  email: false,
  street: false,
  house: false,
  apartment: false
};

const DEFAULT_FORM_DATA: CheckoutFormData = {
  fullName: "",
  city: "",
  email: "",
  apartment: "",
  house: "",
  street: ""
};

const FIRST_STAGE: CheckoutStages = 1;
const SECOND_STAGE: CheckoutStages = 2;
const THIRD_STAGE: CheckoutStages = 3;

const TITLE = "Оплата";

const cookie = new Cookie();

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const CheckoutPage: NextPage = () => {
  const router = useRouter();
  const itemsQuantity = useSelector<RootStore>(
    store => store.cart.items.length
  ) as number;
  const { isLoaded } = useMatchMedia();
  const [validationErrors, setValidationErrors] = useState(DEFAULT_VALIDATION);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [stripeClientSecret, setStripeClientSecret] = useState<
    string | undefined
  >(undefined);
  const [currentStage, setCurrentStage] = useState<CheckoutStages>(FIRST_STAGE);

  const options: StripeElementsOptions = {
    clientSecret: stripeClientSecret
  };

  const switchStage = useCallback((newStage: CheckoutStages) => {
    return () => {
      setCurrentStage(newStage);
    };
  }, []);

  function checkValidation(): CheckoutValidationData {
    const validation = validateFormData(formData);

    const newValidationErrors = { ...validationErrors };
    const arrayOfValidationItems = Object.entries(validation);

    for (const [field, value] of arrayOfValidationItems) {
      newValidationErrors[field as CheckoutValidationFields] = value;
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
    const newFormState = { ...formData };
    newFormState[name as CheckoutValidationFields] = value;
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
    const decision = isLoaded && shouldBeRedirected;

    if (decision) router.push("/");
  }, [itemsQuantity, router, isLoaded]);

  useEffect(() => {
    async function fetchClientSecret() {
      const endpoint =
        process.env.NEXT_PUBLIC_HOSTNAME + "/api/createPaymentIntent";

      const result = await fetch(endpoint, { method: "POST" });

      if (!result.ok || !result) {
        // TODO: make it visible
        throw new Error(
          "Checkout page: stripe payment intent has not been retrieved successfully"
        );
      }

      const data: CreatePaymentIntentResponse = await result.json();
      setStripeClientSecret(data.secret as string);
    }

    if (currentStage === THIRD_STAGE && stripeClientSecret === undefined) {
      fetchClientSecret();
    }
  }, [currentStage, stripeClientSecret]);

  return (
    <>
      <MetaHead title={TITLE} noindex />
      <h1>{TITLE}</h1>

      <form onChange={formChange} className="space-y-2">
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
          {stripeClientSecret === undefined ? (
            <div className="flex items-center justify-center space-x-2">
              <span>Создание заказа</span>
              <LoadingSpinner size={15} />
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
