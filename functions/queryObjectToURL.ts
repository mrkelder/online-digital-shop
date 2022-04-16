interface QueryObject {
  [key: string]: unknown | unknown[];
}

function keyValueQueryCreator([name, valueOrValues]: [
  unknown,
  unknown | unknown[]
]): string {
  if (Array.isArray(valueOrValues)) {
    return valueOrValues.map(value => `${name}=${value}`).join("&");
  }

  return `${name}=${valueOrValues}`;
}

function queryObjectToURL(queryObject: QueryObject): string {
  const arrayFromQueryObject = Object.entries(queryObject);

  if (arrayFromQueryObject.length > 0)
    return "?" + arrayFromQueryObject.map(keyValueQueryCreator).join("&");

  return "";
}

export default queryObjectToURL;
