import { FC } from "react";

import LdJson from "utils/LdJson";

import MetaHead from "../MetaHead";
import MetaScript from "../MetaScript";

interface Props {
  itemObj: Product;
}

const ItemPageMeta: FC<Props> = ({ itemObj }) => {
  return (
    <div itemScope itemType="https://schema.org/Product">
      <MetaHead
        title={itemObj.name}
        keywords={itemObj.description}
        description={itemObj.description}
      />

      <MetaScript id="product-structured-data">
        {LdJson.itemProduct(itemObj)}
      </MetaScript>

      <meta itemProp="name" content={itemObj.name} />
      <link itemProp="image" href={itemObj.photo?.image2x} />
      <meta itemProp="description" content={itemObj.description} />

      <div itemProp="offers" itemType="https://schema.org/Offer" itemScope>
        <meta
          itemProp="availability"
          content={`https://schema.org/${
            itemObj.available ? "InStock" : "OutOfStock"
          }`}
        />
        <meta itemProp="priceCurrency" content="UAH" />
        <meta
          itemProp="itemCondition"
          content="https://schema.org/UsedCondition"
        />
        <meta itemProp="price" content={itemObj.price.toString()} />
      </div>

      <div
        itemProp="aggregateRating"
        itemType="https://schema.org/AggregateRating"
        itemScope
      >
        <meta itemProp="reviewCount" content="1" />
        <meta itemProp="ratingValue" content={itemObj.rating.toString()} />
      </div>
    </div>
  );
};

export default ItemPageMeta;
