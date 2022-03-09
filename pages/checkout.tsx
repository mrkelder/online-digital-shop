import {
  ChangeEvent,
  Dispatch,
  FormEventHandler,
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

const DEFAULT_VALIDATION: CheckotInfo = {
  fullName: false,
  country: false,
  city: false,
  zipCode: false,
  number: false,
  date: false,
  pin: false,
  email: false
};

const DEFAULT_FORM_DATA: FormData = {
  fullName: "",
  country: "",
  city: "",
  zipCode: "",
  number: "",
  date: "",
  pin: "",
  email: ""
};

const DEFAULT_PAYMENT_INFO: PaymentInfo = {
  paymentSent: false,
  paymentSuccess: "none"
};

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

  const submitCheckout: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    const validation = validateFormData(formData);

    if (validation && !loadedLocalStorage) {
      const newValidationErrors = { ...validationErrors };
      newValidationErrors[validation] = true;
      setValidationErrors(newValidationErrors);
    } else {
      setPaymentInfo({ paymentSuccess: "none", paymentSent: true });
      setTimeout(() => {
        dispatch({ type: "cart/restore" });
        setPaymentInfo({ paymentSent: true, paymentSuccess: true });
      }, 3000);
    }
  };

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

      <div className="space-y-2">
        <StageWrapper title="Данные о покупателе" stageNumber={1} active={true}>
          <form>
            <div className="space-y-3 ">
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
            <div className="w-36 mt-3">
              <Button>Продолжить</Button>
            </div>
          </form>
        </StageWrapper>

        <StageWrapper title="Место получения" stageNumber={2} active={true}>
          <form>
            <div className="space-y-3">
              {useMemo(
                () => (
                  <CheckoutInput
                    name="country"
                    placeholder="Страна"
                    error={validationErrors.country}
                    value={formData.country}
                    errorMessage="Указана неверная страна"
                  />
                ),
                [validationErrors.country, formData.country]
              )}
              {useMemo(
                () => (
                  <CheckoutInput
                    name="city"
                    placeholder="Город"
                    error={validationErrors.city}
                    value={formData.city}
                    errorMessage="Указан неверный город"
                  />
                ),
                [validationErrors.city, formData.city]
              )}
              {useMemo(
                () => (
                  <CheckoutInput
                    name="zipCode"
                    placeholder="Почтовый индекс"
                    error={validationErrors.zipCode}
                    value={formData.zipCode}
                    errorMessage="Указан неверный почтовый индекс"
                  />
                ),
                [validationErrors.zipCode, formData.zipCode]
              )}
            </div>
            <div className="w-36 mt-3">
              <Button>Продолжить</Button>
            </div>
          </form>
        </StageWrapper>

        <StageWrapper title="Оплата" stageNumber={3} active={true}>
          <form>
            {/* Placeholder for Stripe */}
            <div className="w-48 mt-3">
              <Button variant="lg">Продолжить</Button>
            </div>
          </form>
        </StageWrapper>
      </div>
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
