const keys = [
  "apartment",
  "city",
  "email",
  "fullName",
  "house",
  "street",
  "stripeClientId"
];

export default function isKeyOfCheckoutData(key: string) {
  return keys.includes(key);
}
