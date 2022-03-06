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

      {/* <div itemProp="review" itemType="https://schema.org/Review" itemScope>
            <div
              itemProp="reviewRating"
              itemType="https://schema.org/Rating"
              itemScope
            >
              <meta
                itemProp="ratingValue"
                content={itemObj.rating.toString()}
              />
              <meta itemProp="bestRating" content="5" />
              <meta itemProp="worstRating" content="0" />
            </div>
          </div> */}
    </>
  );
};

export default ItemPageMeta;
