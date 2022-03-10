export interface FormData {
  fullName: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  email: string;
}

export type CheckotInfo = OptionsFlags<FormData>;

const FULLNAME_REG =
  /^ *[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]{1,} +[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]{1,} *$/;
const EMAIL_REG =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export function validateFormData(obj: FormData): CheckotInfo {
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
