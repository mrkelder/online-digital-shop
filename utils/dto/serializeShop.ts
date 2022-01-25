export default function serializeShop(shop: FirebaseShop): Shop {
  const { _lat, _long } = shop.geo;
  return { ...shop, geo: { lat: _lat, lng: _long } };
}
