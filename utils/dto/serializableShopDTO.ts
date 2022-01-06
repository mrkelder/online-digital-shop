export default function serializableShopDTO(shop: Shop) {
  const { _lat, _long } = shop.geo;
  return { ...shop, geo: { _lat, _long } };
}
