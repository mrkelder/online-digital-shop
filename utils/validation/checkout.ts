export interface FormData {
  fullName: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  email: string;
}

const FULLNAME_REG =
  /^ *[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]{1,} +[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]{1,} *$/;
const EMAIL_REG =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export function validateFormData(obj: FormData): keyof FormData | undefined {
  const { fullName, house, city, email, apartment, street } = obj;
  if (!FULLNAME_REG.test(fullName)) return "fullName";
  if (apartment.length < 1) return "apartment";
  if (house.length < 1) return "house";
  if (city.length < 1) return "city";
  if (street.length < 1) return "street";
  if (!EMAIL_REG.test(email)) return "email";
}

export type CheckotInfo = OptionsFlags<FormData>;
