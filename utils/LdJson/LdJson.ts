import { FAQQuestion } from "types/staic-page";

class LdJson {
  public static faqPage(questions: FAQQuestion[]): string {
    const obj = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: questions.map(i => ({
        "@type": "Question",
        name: i.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: i.answer
        }
      }))
    };

    return JSON.stringify(obj);
  }

  public static itemProduct(itemObj: Product) {
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
}

export default LdJson;
