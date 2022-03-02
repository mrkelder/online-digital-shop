import {
  ChangeEvent,
  Dispatch,
  FormEventHandler,
  useEffect,
  useMemo,
  useState
} from "react";

import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import Button from "components/Button";
import Card from "components/checkout-page/Card";
import CheckoutInput from "components/checkout-page/CheckoutInput";
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
  pin: false
};

const DEFAULT_FORM_DATA: FormData = {
  fullName: "",
  country: "",
  city: "",
  zipCode: "",
  number: "",
  date: "",
  pin: ""
};

const DEFAULT_PAYMENT_INFO: PaymentInfo = {
  paymentSent: false,
  paymentSuccess: "none"
};

const RESULT_STYLE = "flex flex-col items-center space-y-2";

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

  const memoizedCard = useMemo(
    () => (
      <Card
        info={{
          number: formData.number,
          date: formData.date,
          pin: formData.pin
        }}
        validation={{
          number: validationErrors.number,
          date: validationErrors.date,
          pin: validationErrors.pin
        }}
      />
    ),
    [
      formData.number,
      formData.date,
      formData.pin,
      validationErrors.number,
      validationErrors.date,
      validationErrors.pin
    ]
  );

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
    <div className="max-w-7xl mx-auto lg:px-12">
      <Head>
        <title>Оплата</title>
      </Head>

      <h1>Оплата</h1>

      <form
        className={
          "my-2 space-y-3 gap-x-6 grid-cols-1 sm:grid-cols-2 " + formStyle
        }
        onSubmit={submitCheckout}
        onChange={formChange}
      >
        <div>
          <h2 className="mb-2">Информация о покупателе</h2>
          <div className="space-y-3 mb-3 sm:mb-0">
            {useMemo(
              () => (
                <CheckoutInput
                  error={validationErrors.fullName}
                  value={formData.fullName}
                  name="fullName"
                  placeholder="Фамилия Имя"
                  errorMessage="Форма может содержать русские, английские или украинские символы"
                />
              ),
              [validationErrors.fullName, formData.fullName]
            )}
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
        </div>
        <div className="sm:mx-auto">
          <h2 className="mb-2">Информация о карте</h2>
          {memoizedCard}
        </div>
        <div className="w-56 mt-3">
          <Button variant="lg">Оформить заказ</Button>
        </div>
      </form>

      <div className={"pt-10 " + paymentResultStyle}>
        <div className={paymentLoadingStyle}>
          <div className="w-16 text-red animate-spin mx-auto">
            <LoadingIcon />
          </div>
          <p>Выполняем оплату</p>
        </div>

        <div className={paymentSuccessStyle}>
          <div className="w-16 text-success">
            <SuccessIcon />
          </div>
          <p>Оплата прошла успешно!</p>
          <Link href="/">
            <a className="text-base underline">Перейти на главную</a>
          </Link>
        </div>

        <div className={paymentFailureStyle}>
          <div className="w-16 text-red">
            <FailureIcon />
          </div>
          <p>Не удалось совершить оплату</p>
          <Link href="/">
            <a className="text-base underline">Перейти на главную</a>
          </Link>
        </div>
      </div>
    </div>
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
