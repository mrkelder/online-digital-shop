type FirebaseGeo = { geo: { _lat: number; _long: number } };

export default function serializableShopDTO(
  shop: Omit<Shop, "geo"> & FirebaseGeo
): Shop {
  const { _lat, _long } = shop.geo;
  return { ...shop, geo: { lat: _lat, lng: _long } };
}
