import { NextPage } from "next";

import GuaranteeMeta from "components/meta/GuaranteeMeta";
import useLanguage from "hooks/useLanguage";

const GuaranteePage: NextPage = () => {
  const { langVariant } = useLanguage();
  const title = langVariant("Гарантія", "Гарантия");

  return (
    <div className="slg:max-w-full lg:mx-auto lg:px-12">
      <GuaranteeMeta />

      <h1>{title}</h1>
      <div className="space-y-4">
        <p>
          {langVariant(
            `Весь представлений товар офіційно поставляється в Україну та
            супроводжується гарантією, що надається уповноваженими
            сервісними центрами. На різні групи товарів можуть бути встановлені
            різні терміни гарантійного обслуговування, зазначені на сторінці
            відповідного товару, а також у гарантійному талоні, який Ви
            отримайте разом із товаром.`,

            `Весь представленный товар официально поставляется в Украину и
          сопровождается гарантией, которая предоставляется уполномоченными
          сервисными центрами. На разные группы товаров могут быть установлены
          различные сроки гарантийного обслуживания, которые указаны на странице
          соответствующего товара, а также в гарантийном талоне, который Вы
          получите вместе с товаром.`
          )}
        </p>

        <p>
          {langVariant(
            `У разі виходу з ладу товару у період дії гарантійного строку
           необхідно звернутися до відповідного сервісного центру. Якщо у Вашому
           місті відсутній необхідний сервісний центр – ми Вам допоможемо з
           передачею товару в сервісний центр, для цього Ви можете звернутись до
           наш магазин у вашому місті. Також Ви можете звернутися за номером
           гарячої лінії 0800-40-40-40, де наші консультанти підкажуть як
           передати товар за допомогою кур'єрської служби.`,

            `В случае выхода из строя товара в период действия гарантийного срока
           необходимо обратится в соответствующий сервисный центр. Если в Вашем
           городе отсутствует необходимый сервисный центр – мы Вам поможем с
           передачей товара в сервисный центр, для этого Вы можете обратится в
           наш магазин в вашем городе. Также Вы можете обратиться по номеру
           горячей линии 0800-40-40-40, где наши консультанты подскажут как
           передать товар с помощью курьерской службы.`
          )}
        </p>

        <div>
          <p>
            {langVariant(
              `Для передачі товару на сервісне обслуговування у період дії гарантійного періоду не забудьте:`,
              `Для передачи товара на сервисное обслуживание в период действия гарантийного периода не забудьте:`
            )}
          </p>
          <ul className="list-disc text-sm mt-1 pl-5">
            <li>
              {langVariant(
                `Товар з повною комплектацією постачання (упаковка, зарядне
               пристрій, інструкція користувача тощо)`,

                `Товар с полной комплектацией поставки (упаковка, зарядное
              устройство, инструкция пользователя и т.д.)`
              )}
            </li>
            <li>
              {langVariant(
                `Документ, що підтверджує покупку (фіскальний чек або видаткова
               накладна, залежно від типу оплати)`,

                `Документ подтверждающий покупку (фискальный чек или расходная
              накладная, в зависимости от типа оплаты)`
              )}
            </li>
            <li>
              {langVariant(
                `Гарантійний талон на виріб.`,
                `Гарантийный талон на изделие.`
              )}
            </li>
          </ul>
        </div>

        <div>
          <p>
            {langVariant(
              `Гарантійні зобов'язання не поширюються на вироби наступних випадках:`,
              `Гарантийные обязательства не распространяются на изделия в следующих случаях:`
            )}
          </p>
          <ul className="list-disc text-sm mt-1 pl-5">
            <li>
              {langVariant(
                `Є сліди стороннього втручання, ремонту, зміни
               внутрішніх комунікацій та схем неуповноваженими особами`,

                `Есть следы постороннего вмешательства, ремонта, изменения
              внутренних коммуникаций и схем неуполномоченными лицами `
              )}
            </li>
            <li>
              {langVariant(
                `Є сліди ушкодження, які були спричинені використанням товару
               з порушенням правил експлуатації або не за призначенням`,

                `Есть следы повреждения, которые были вызваны использованием товара
              с нарушением правил эксплуатации или не по назначению`
              )}
            </li>
            <li>
              {langVariant(
                `Серійний номер або MAC-адреса, що знаходяться в пам'яті виробу,
                змінені, стерті або пошкоджені та не можуть бути встановлені`,

                `Серийный номер или MAC-адрес, находящиеся в памяти изделия,
                изменены, стёрты или повреждены и не могут быть установлены`
              )}
            </li>
            <li>
              {langVariant(
                `Відсутні та/або пошкоджені гарантійні пломби, наклейки, а також
                інші маркування, передбачені виробником`,

                `Отсутствуют и/или повреждены гарантийные пломбы, наклейки, а также
              иные маркировки, предусмотренные производителем`
              )}
            </li>
            <li>
              {langVariant(
                `Дефект виробу викликало використання не передбачених
                виробником витратних матеріалів та аксесуарів, запасних
                частин, елементів живлення, носіїв інформації`,

                `Дефект изделия вызвало использование не предусмотренных
                производителем расходных материалов и аксессуаров, запасных
                частей, элементов питания, носителей информации`
              )}
            </li>
            <li>
              {langVariant(
                `Дефект виробу викликаний стихійними лихами, навмисними або
               ненавмисними діями користувача або третіми особами`,

                `Дефект изделия вызван стихийными бедствиями, умышленными или
              неумышленными действиями пользователя или третьими лицами`
              )}
            </li>
            <li>
              {langVariant(
                `Виявлено сліди влучення всередину виробу сторонніх предметів,
               будь-яких рідин та речовин`,

                `Обнаружены следы попадания внутрь изделия посторонних предметов,
              любых жидкостей и веществ`
              )}
            </li>
            <li>
              {langVariant(
                `Виявлено сліди впливу на виріб невластивих температур
                (підвищених або знижених), вібрації, електричних розрядів
                (викликаних коливанням напруги в мережі живлення, використанням
                неправильної вхідної напруги)`,

                `Обнаружены следы воздействия на изделие несвойственных температур
              (повышенных или пониженных), вибрации, электрических разрядов
              (вызванных колебанием напряжения в сети питания, использованием
              неправильного входного напряжения)`
              )}
            </li>
            <li>
              {langVariant(
                `Пошкодження або ненормальне функціонування виробу спричинено
               використанням програмного забезпечення, яке не входить до
               комплект, неліцензійне або неправильно встановлено, а також
               вірусне ураження.`,

                `Повреждение или ненормальное функционирование изделия вызвано
              использованием программного обеспечения, которое не входит в
              комплект, нелицензионное или было неправильно установлено, а также
              вирусное поражение.`
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GuaranteePage;
