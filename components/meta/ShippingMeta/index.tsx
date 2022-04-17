import { FC } from "react";

import useLanguage from "hooks/useLanguage";
import { FAQQuestion } from "types/staic-page";
import LdJson from "utils/LdJson";

import MetaHead from "../MetaHead";
import MetaScript from "../MetaScript";

const ShippingMeta: FC = () => {
  const { langVariant } = useLanguage();

  const questions: FAQQuestion[] = [
    {
      question: "Доставка",
      answer: langVariant(
        "Доставка здійснюється самовивозом, а також доставкою за адресою",
        "Доставка осуществляется самовывозом, а также доставкой по адресу"
      )
    },
    {
      question: "Оплата",
      answer: langVariant(
        "Сплатити товар можна як готівкою при отриманні, так і банківською карткою на сайті",
        "Оплатить товар можно как наличными деньгами при получении, так и банковской картой на сайте"
      )
    }
  ];

  return (
    <>
      <MetaHead
        title={langVariant("Доставка і оплата", "Доставка и оплата")}
        keywords={langVariant(
          "Доставка, доставка по Україні, оплата, оплата карткою, New London",
          "Доставка, доставка по Украине, оплата, оплата картой, New London"
        )}
        description={langVariant(
          "Доставка здійснюється по всій території України. Способами оплати можуть бути як готівковий, і безготівковий розрахунок",
          "Доставка осуществляется по всей территории Украины. Способами оплаты могут послужить как наличный, так и безналичный расчет"
        )}
      />

      <MetaScript id="shipping-structured-data">
        {LdJson.faqPage(questions)}
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
