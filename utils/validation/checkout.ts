export interface FormData {
  fullName: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  number: string;
  date: string;
  pin: string;
  email: string;
}

const FULLNAME_REG =
  /^ *[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]{1,} +[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]{1,} *$/;
const EXPIRATIONAL_DATE_REG = /\d{2}\/\d{2}/;
const EMAIL_REG =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

function removeSpaces(str: string) {
  return str.replace(/ /g, "");
}

function includesOnlyNumbers(str: string) {
  return /^[0-9]+$/g.test(removeSpaces(str));
}

export function validateFormData(obj: FormData): keyof FormData | undefined {
  const { fullName, house, city, email, apartment, number, date, pin, street } =
    obj;
  if (!FULLNAME_REG.test(fullName)) return "fullName";
  if (apartment.length < 1) return "apartment";
  if (house.length < 1) return "house";
  if (city.length < 1) return "city";
  if (street.length < 1) return "street";
  if (!includesOnlyNumbers(number) || removeSpaces(number).length !== 16)
    return "number";
  if (!EXPIRATIONAL_DATE_REG.test(date)) return "date";
  if (!includesOnlyNumbers(pin) || removeSpaces(pin).length !== 3) return "pin";
  if (!EMAIL_REG.test(email)) return "email";
}

export type CheckotInfo = OptionsFlags<FormData>;
