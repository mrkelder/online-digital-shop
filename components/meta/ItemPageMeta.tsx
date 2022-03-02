import { FC } from "react";

import Head from "next/head";
import Script from "next/script";

import ldJsonItemProduct from "utils/ldJsonMeta/ldJsonItemProduct";

interface Props {
  itemObj: Product;
}

const ItemPageMeta: FC<Props> = ({ itemObj }) => {
  return (
    <>
      <Head>
        <title>{itemObj.name}</title>
        <meta name="keywords" content={itemObj.name} />
        <meta name="description" content={itemObj.description} />
        <meta name="author" content="New London" />
      </Head>

      <Script id="product-structured-data" type="application/ld+json">
        {ldJsonItemProduct(itemObj)}
      </Script>

      <div itemProp="aggregateRating" itemScope>
        <meta itemProp="ratingValue" content={itemObj.rating.toString()} />
        <meta itemProp="bestRating" content="5" />
        <meta itemProp="worstRating" content="0" />
        <meta itemProp="ratingCount" content="1" />
        <meta itemProp="itemReviewed" content={itemObj.name} />
      </div>

      <meta itemProp="price" content={itemObj.price.toString()} />
      <meta itemProp="priceCurrency" content="UAH" />

      <meta
        itemProp="availability"
        content={itemObj.available ? "In Stock" : "Out of stock"}
      />

      <meta itemProp="image" content={itemObj.photo?.image2x} />
    </>
  );
};

export default ItemPageMeta;
