import { FC } from "react";

import ldJsonItemProduct from "utils/ldJsonMeta/ldJsonItemProduct";

import MetaHead from "../MetaHead";
import MetaScript from "../MetaScript";

interface Props {
  itemObj: Product;
}

const ItemPageMeta: FC<Props> = ({ itemObj }) => {
  return (
    <>
      <MetaHead
        title={itemObj.name}
        keywords={itemObj.description}
        description={itemObj.description}
      />

      <MetaScript id="product-structured-data">
        {ldJsonItemProduct(itemObj)}
      </MetaScript>

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
