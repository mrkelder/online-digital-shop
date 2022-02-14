import Firebase from "utils/firebase";

export interface CharacteristicQuery {
  valueIndex: number;
  id: string;
}

type CompoundCharacteristic = Pick<CharacteristicQuery, "id"> & {
  valueIndexes: number[];
};

type FirebaseProductPromiseArray = Promise<FirebaseProduct[]>;

interface FetchCatalogReturnValue {
  items: FirebaseProduct[];
  amountOfItems: number;
}

const firebase = new Firebase();

function characteristicFormatter(c: string): CharacteristicQuery {
  const [id, valueIndex] = c.split(".");
  return { id, valueIndex: Number(valueIndex) };
}

function getCharacteristicsArray(
  queriesStringArray: string[]
): CharacteristicQuery[] {
  if (typeof queriesStringArray === "string")
    return [characteristicFormatter(queriesStringArray)];
  else
    return queriesStringArray.map(i =>
      characteristicFormatter(i)
    ) as CharacteristicQuery[];
}

function groupCharacteristicsByIds(
  characteristics: CharacteristicQuery[]
): CompoundCharacteristic[] {
  const cArray: CompoundCharacteristic[] = [];

  for (const i of characteristics) {
    const foundIndex = cArray.findIndex(c => c.id === i.id);
    if (foundIndex !== -1) {
      cArray[foundIndex].valueIndexes.push(i.valueIndex);
    } else {
      cArray.push({
        id: i.id,
        valueIndexes: [i.valueIndex]
      });
    }
  }

  return cArray;
}

function getQueryPromises(
  compoundCharacteristics: CompoundCharacteristic[]
): FirebaseProductPromiseArray[] {
  const quaries: FirebaseProductPromiseArray[] = [];

  for (const i of compoundCharacteristics) {
    const query = firebase.getDocumentsByQuery<FirebaseProduct>("products", [
      {
        field: `characteristics.${i.id}`,
        condition: "in",
        value: i.valueIndexes
      }
    ]);

    quaries.push(query);
  }

  return quaries;
}

function groupProductsByIds(
  arrayProducts: FirebaseProduct[][]
): FirebaseProduct[] {
  const fProducts: FirebaseProduct[] = [];

  for (const arr of arrayProducts) {
    for (const product of arr) {
      if (!fProducts.find(i => i.id === product.id)) fProducts.push(product);
    }
  }

  return fProducts;
}

function returnGroupedArrayOrAllItems(
  data: FirebaseProduct[][],
  allProducts: FirebaseProduct[]
) {
  if (data.length === 0) return allProducts;
  return groupProductsByIds(data);
}

function skipAndLimit(
  products: FirebaseProduct[],
  skip: number,
  limit: number
) {
  return products.slice(skip, limit);
}

async function fetchCatalog(
  query: {
    c?: string[];
    min?: number;
    max?: number;
  },
  minPrice: number,
  maxPrice: number,
  allProducts: FirebaseProduct[],
  skip: number,
  limit: number
): Promise<FetchCatalogReturnValue> {
  if (query.c || query.min || query.max) {
    const min = Number(query.min ?? minPrice);
    const max = Number(query.max ?? maxPrice);

    const characteristics = getCharacteristicsArray(query.c ?? []);
    const compoundCharacteristics = groupCharacteristicsByIds(characteristics);
    const quaries = getQueryPromises(compoundCharacteristics);

    const data = await Promise.all(quaries);

    const firebaseProducts = returnGroupedArrayOrAllItems(
      data,
      allProducts
    ).filter(i => i.price >= min && i.price <= max);

    console.log(skipAndLimit(firebaseProducts, skip, limit).length);

    return {
      items: skipAndLimit(firebaseProducts, skip, limit),
      amountOfItems: firebaseProducts.length
    };
  }

  return {
    items: skipAndLimit(allProducts, skip, limit),
    amountOfItems: allProducts.length
  };
}

export default fetchCatalog;
