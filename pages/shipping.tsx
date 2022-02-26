import TextBlock from "components/TextBlock";
import { NextPage } from "next";
import Head from "next/head";

const TITLE = "Доставка и оплата";

const ShippingPage: NextPage = () => (
  <div className="lg:max-w-full lg:mx-auto lg:px-12">
    <Head>
      <title>{TITLE}</title>
    </Head>

    <h1>{TITLE}</h1>
    <h2>Доставка</h2>
    <div className="mt-3 space-y-5">
      <TextBlock title="Самовывоз">
        <p>
          Вы имеете возможность забрать заказ в удобном для вас магазине нашей
          сети в удобное для вас время в режиме работы магазина. Если товара нет
          в наличии в выбранном вами магазине, не беда. Мы доставим его
          абсолютно бесплатно в максимально сжатые сроки и, конечно же, уведомим
          о том, что товар вас ожидает. Мы резервируем для вас товар на три дня.
          Для того чтобы получить заказ, вам необходимо назвать сотруднику
          магазина только номер заказа, который будет отправлен на ваш номер
          телефона после подтверждения. При получении заказа в магазине вы
          можете оплатить его любым удобным для вас способом: наличными,
          банковской платежной картой Visa/MasterCard, по безналичному расчету
          или оформить кредит, а также воспользоваться сервисами «Оплата
          частями» и «Мгновенная рассрочка» от нашего банка-партнера ПриватБанк.
        </p>
      </TextBlock>

      <TextBlock title="Доставка по адресу">
        <p>
          Вы можете получить заказ не выходя из дома или офиса. Для этого при
          оформлении заказа укажите полный адрес доставки, и курьер доставит его
          вам. Оплатить заказ вы можете предварительно при оформлении на сайте -
          банковской платежной картой Visa/MasterCard, через Приват24, с помощью
          сервисов ПриватБанка «Оплата частями» и «Мгновенная рассрочка», а
          также по безналичному расчету, согласно счета-фактуры. Также есть
          возможность оплатить заказ курьеру при доставке.
        </p>
        <p>
          Доставка по адресу осуществляется в течение трех рабочих дней. При
          поступлении товара в ваш населенный пункт с вами свяжется курьер и
          согласует удобные дату и время получения.
        </p>
        <p>
          Стоимость доставки при заказе до 500 грн. составляет 50 грн., если же
          сумма вашего заказа свыше 500 грн. - мы доставим его бесплатно.
        </p>
      </TextBlock>
      <h2>Оплата</h2>
      <div className="mt-3 space-y-5">
        <TextBlock title="Наличными при получении">
          <p>
            Оплатить наличными при получении заказа можно как в магазинах нашей
            сети, на отделении курьерской службы, так и при адресной доставке.
          </p>
        </TextBlock>
        <TextBlock title="Банковской платежной картой на сайте">
          <p>
            Вы можете оплатить заказ сразу при оформлении на сайте банковской
            платежной картой Visa/MasterCard. Данный тип оплаты возможен при
            выборе доставки на отделение курьерской службы или доставки по
            адресу.
          </p>
        </TextBlock>
      </div>
    </div>
  </div>
);

export default ShippingPage;
