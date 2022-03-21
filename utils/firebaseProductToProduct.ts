import DTO from "utils/DTO";
import Firebase from "utils/firebase";

const firebase = new Firebase();

// FIXME: extract aggregations to a separate class (like fetchCharacteristicsObjects)
// FIXME: turn all "serialize" into "convert"

function findCharacteristicById(
  id: string,
  characteristics: Characteristic[]
): Characteristic {
  const result = characteristics.find(i => i.id === id) as Characteristic;
  return result;
}

async function fetchCharacteristicsObjects(
  characteristicsIds: string[]
): Promise<Characteristic[]> {
  return await firebase.getDocumentsByIds<Characteristic>(
    "characteristics",
    characteristicsIds
  );
}

async function fetchAvailableCities(product: FirebaseProduct): Promise<Shop[]> {
  const dto = new DTO();

  return (
    await firebase.getDocumentsByIds<FirebaseShop>(
      "shops",
      product.available_in
    )
  ).map(i => dto.firebaseShopToShop(i));
}

function convertToCharacteristics(
  fbProduct: FirebaseProduct,
  characteristicsObjects: Characteristic[]
): Product["characteristics"] {
  return Object.entries(fbProduct.characteristics).map(([id, valueIndex]) => ({
    id,
    name: findCharacteristicById(id, characteristicsObjects).name,
    value: findCharacteristicById(id, characteristicsObjects).values[valueIndex]
  }));
}

function findKeyCharacteristics(
  fbProduct: FirebaseProduct,
  productCharacteristics: Product["characteristics"]
): Product["key_characteristics"] {
  return fbProduct.key_characteristics.map(id =>
    productCharacteristics.find(c => c.id === id)
  ) as ProductCharacteristic[];
}

async function firebaseProductToProduct(
  fbProduct: FirebaseProduct
): Promise<Product> {
  const characteristicsIds = Object.keys(fbProduct.characteristics);

  const characteristicsObjects = await fetchCharacteristicsObjects(
    characteristicsIds
  );

  const available_in = await fetchAvailableCities(fbProduct);

  const productCharacteristics = convertToCharacteristics(
    fbProduct,
    characteristicsObjects
  );

  const key_characteristics = findKeyCharacteristics(
    fbProduct,
    productCharacteristics
  );

  const itemObj: Product = {
    ...fbProduct,
    characteristics: productCharacteristics,
    key_characteristics,
    available_in
  };

  return itemObj;
}

export default firebaseProductToProduct;
