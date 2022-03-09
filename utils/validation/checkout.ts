export interface FormData {
  fullName: string;
  country: string;
  city: string;
  zipCode: string;
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
  const { fullName, country, city, zipCode, number, date, pin } = obj;
  if (!FULLNAME_REG.test(fullName)) return "fullName";
  if (country.length < 1) return "country";
  if (city.length < 1) return "city";
  if (zipCode.length < 1) return "zipCode";
  if (!includesOnlyNumbers(number) || removeSpaces(number).length !== 16)
    return "number";
  if (!EXPIRATIONAL_DATE_REG.test(date)) return "date";
  if (!includesOnlyNumbers(pin) || removeSpaces(pin).length !== 3) return "pin";
  if (!EMAIL_REG.test(obj.email)) return "email";
}

export type CheckotInfo = OptionsFlags<FormData>;
