export default function ldJsonItemProduct(itemObj: Product) {
  const obj = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: itemObj.name,
    image: [itemObj.photo?.image2x],
    description: itemObj.description,
    aggregateRating: {
      "@type": "AggregateRating",
      itemReviewed: {
        "@type": "Thing",
        name: itemObj.name
      },
      bestRating: "5",
      worstRating: "0",
      ratingCount: "1",
      ratingValue: itemObj.rating.toString()
    },
    price: itemObj.price.toString(),
    priceCurrency: "UAH",
    availability: itemObj.available ? "In Stock" : "Out of stock"
  };

  return JSON.stringify(obj);
}
