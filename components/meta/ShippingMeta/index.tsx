import { FC } from "react";

import ldJsonFAQPage, { FAQQuestion } from "utils/ldJsonMeta/ldJsonFAQPage";

import MetaHead from "../MetaHead";
import MetaScript from "../MetaScript";

const questions: FAQQuestion[] = [
  {
    question: "Доставка",
    answer: "Доставка осуществляется самовывозом, а также доставкой по адресу"
  },
  {
    question: "Оплата",
    answer:
      "Оплатить товар можно как наличными деньгами при получении, так и банковской картой на сайте"
  }
];

const ShippingMeta: FC = () => {
  return (
    <>
      <MetaHead
        title="Доставка и оплата"
        keywords="Доставка, доставка по Украине, оплата, оплата картой, New London"
        description="Доставка осуществляется по всей территории Украины. Способами оплаты могут послужить как наличный, так и безналичный расчет"
      />

      <MetaScript id="shipping-structured-data">
        {ldJsonFAQPage(questions)}
      </MetaScript>

      <div itemScope itemType="https://schema.org/FAQPage">
        {questions.map(i => (
          <div
            key={i.question}
            itemProp="mainEntity"
            itemScope
            itemType="https://schema.org/Question"
          >
            <meta itemProp="name" content={i.question} />

            <div
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <meta itemProp="text" content={i.answer} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ShippingMeta;
