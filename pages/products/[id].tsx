import Button from "components/Button";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Firebase from "utils/firebase";

const ProductPage: NextPage = () => {
  return (
    <>
      <Button variant="lg">Купить</Button>
    </>
  );
};

const firebase = new Firebase();

export const getStaticProps: GetStaticProps = async context => {
  const result = await firebase.getDocumentsById("products", [
    context.params?.id as string
  ]);

  if (result.length === 0)
    return {
      notFound: true
    };

  return {
    props: { itemObj: result[0] }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await firebase.getAllDocumentsInCollection<Product>(
    "products"
  );

  const paths = products.map(i => ({ params: { id: i.id } }));

  return {
    paths,
    fallback: "blocking"
  };
};

export default ProductPage;
