import Button from "components/Button";
import Input from "components/Input";
import Card from "components/checkout-page/Card";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";

const CheckoutPage: NextPage = () => {
  function submitCheckout(e) {
    e.preventDefault();
  }

  return (
    <div className="py-1.5 px-3 max-w-7xl mx-auto lg:px-12">
      <Head>
        <title>Оплата</title>
      </Head>

      <h1>Оплата</h1>

      <form
        className="my-2 space-y-3 gap-x-6 grid grid-cols-1 sm:grid-cols-2"
        onSubmit={submitCheckout}
      >
        <div>
          <h2 className="mb-2">Информация о покупателе</h2>
          <div className="space-y-3 mb-3 sm:mb-0">
            <Input underline name="name" placeholder="ФИО" />
            <Input underline name="country" placeholder="Страна" />
            <Input underline name="city" placeholder="Город" />
            <Input underline name="zip-code" placeholder="Почтовый индекс" />
          </div>
        </div>
        <div className="sm:mx-auto">
          <h2 className="mb-2">Информация о карте</h2>
          <Card />
        </div>
        <div className="w-56 mt-3">
          <Button variant="lg">Оформить заказ</Button>
        </div>
      </form>
      {/* Типа VISA, MasterCard, AMEX, МИР */}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};

export default CheckoutPage;
