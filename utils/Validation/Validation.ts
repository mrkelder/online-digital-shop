export type CheckoutFields =
  | "fullName"
  | "city"
  | "street"
  | "house"
  | "apartment"
  | "email";

export type LocalStorageCheckoutFields =
  | CheckoutFields
  | "stripeClientId"
  | "currentStage";

export type CheckoutFormData = Record<CheckoutFields, string>;

export type CheckoutValidationData = OptionsFlags<CheckoutFormData>;

class Validation {
  private static FULLNAME_REG =
    /^ *[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]{1,} +[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]{1,} *$/;
  private static EMAIL_REG =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  private static localStorageCheckoutFormFields: LocalStorageCheckoutFields[] =
    [
      "apartment",
      "city",
      "email",
      "fullName",
      "house",
      "street",
      "stripeClientId"
    ];

  public static checkoutFormData(
    obj: CheckoutFormData
  ): CheckoutValidationData {
    const { fullName, house, city, email, apartment, street } = obj;

    return {
      fullName: !Validation.FULLNAME_REG.test(fullName),
      email: !Validation.EMAIL_REG.test(email),
      city: city.length < 1,
      street: street.length < 1,
      house: house.length < 1,
      apartment: apartment.length < 1
    };
  }

  public static isKeyOfCheckoutData(key: string): boolean {
    return Validation.localStorageCheckoutFormFields.includes(
      key as LocalStorageCheckoutFields
    );
  }
}

export default Validation;
