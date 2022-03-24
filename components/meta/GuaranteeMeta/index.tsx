import { FC } from "react";

import LdJson, { FAQQuestion } from "utils/LdJson";

import MetaHead from "../MetaHead";
import MetaScript from "../MetaScript";

const questions: FAQQuestion[] = [
  {
    question: "Условия гарантийного обслуживания",
    answer:
      "Необходим полный комплект поставки товара, документ покупки, а также гарантийный талон"
  },
  {
    question: "На какие случаи не распространяется гарантия",
    answer:
      "Гарантия не распространяется при повреждении или внутреннем вмешательстве, а также при дополнительных условиях, указаных на сайте"
  }
];

const GuaranteeMeta: FC = () => {
  return (
    <>
      <MetaHead
        title="Гарантия"
        keywords="Гарантии, гарантия"
        description="Магазин New London предоставляет гарантию своим покупателям на все товары и услуги"
      />

      <MetaScript id="guarantee-structured-data">
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

export default GuaranteeMeta;
