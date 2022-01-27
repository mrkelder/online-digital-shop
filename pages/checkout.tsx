import Button from "components/Button";
import Card from "components/checkout-page/Card";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, FormEventHandler, useMemo, useState } from "react";
import {
  CheckotInfo,
  FormData,
  validateFormData
} from "utils/validation/checkout";
import CheckoutInput from "components/checkout-page/CheckoutInput";

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

const CheckoutPage: NextPage = () => {
  const [validationErrors, setValidationErrors] =
    useState<CheckotInfo>(DEFAULT_VALIDATION);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);

  const submitCheckout: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    const validation = validateFormData(formData);

    if (validation) {
      const newValidationErrors = { ...validationErrors };
      newValidationErrors[validation] = true;
      setValidationErrors(newValidationErrors);
    } else {
      alert("Success");
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

  return (
    <div className="py-1.5 px-3 max-w-7xl mx-auto lg:px-12">
      <Head>
        <title>Оплата</title>
      </Head>

      <h1>Оплата</h1>

      <form
        className="my-2 space-y-3 gap-x-6 grid grid-cols-1 sm:grid-cols-2"
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
                  errorMessage="Форма должна содержать фамилию и имя"
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
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};

export default CheckoutPage;
