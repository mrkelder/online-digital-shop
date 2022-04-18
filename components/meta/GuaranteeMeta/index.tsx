import { FC } from "react";

import useLanguage from "hooks/useLanguage";
import { FAQQuestion } from "types/staic-page";
import LdJson from "utils/LdJson";

import MetaHead from "../MetaHead";
import MetaScript from "../MetaScript";

const GuaranteeMeta: FC = () => {
  const { langVariant } = useLanguage();

  const questions: FAQQuestion[] = [
    {
      question: langVariant(
        "Умови гарантійного обслуговування",
        "Условия гарантийного обслуживания"
      ),
      answer: langVariant(
        "Потрібен повний комплект поставки товару, документ купівлі, а також гарантійний талон",
        "Необходим полный комплект поставки товара, документ покупки, а также гарантийный талон"
      )
    },

    {
      question: langVariant(
        "На які випадки не поширюється гарантія",
        "На какие случаи не распространяется гарантия"
      ),
      answer: langVariant(
        "Гарантія не поширюється за умови пошкодження або внутрішнього втручання, а також за додаткових умов, зазначених на сайті",
        "Гарантия не распространяется при повреждении или внутреннем вмешательстве, а также при дополнительных условиях, указаных на сайте"
      )
    }
  ];

  return (
    <>
      <MetaHead
        title={langVariant("Гарантія", "Гарантия")}
        keywords={langVariant("Гарантії, гарантія", "Гарантии, гарантия")}
        description={langVariant(
          "Магазин New London надає гарантію своїм покупцям на всі товари та послуги",
          "Магазин New London предоставляет гарантию своим покупателям на все товары и услуги"
        )}
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
