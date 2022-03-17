// FIXME: rename this file

export type CheckoutValidationFields =
  | "fullName"
  | "city"
  | "street"
  | "house"
  | "apartment"
  | "email";

export type CheckoutFormData = Record<CheckoutValidationFields, string>;

export type CheckoutValidationData = OptionsFlags<CheckoutFormData>;

const FULLNAME_REG =
  /^ *[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]{1,} +[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]{1,} *$/;
const EMAIL_REG =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export function validateFormData(
  obj: CheckoutFormData
): CheckoutValidationData {
  const { fullName, house, city, email, apartment, street } = obj;

  return {
    fullName: !FULLNAME_REG.test(fullName),
    email: !EMAIL_REG.test(email),
    city: city.length < 1,
    street: street.length < 1,
    house: house.length < 1,
    apartment: apartment.length < 1
  };
}
