import { GetServerSideProps, NextPage } from "next";
import categoriesToSubCategoryIds from "utils/dto/categoriesToSubCategoryIds";
import Firebase from "utils/firebase";
import Head from "next/head";
import Link from "next/link";

interface Props {
  category: Category;
  subcategories: SubCategory[];
}

const CategoryPage: NextPage<Props> = ({ category, subcategories }) => {
  return (
    <div>
      <Head>
        <title>{category.name}</title>
      </Head>
      <h1>{category.name}</h1>
      <ul>
        {subcategories.map(i => (
          <li key={i.id} className="bg-white px-5 py-2.5 shadow-xl mb-2">
            <Link href={`/catalog?id=${i.id}`}>
              <a className="text-2xl">{i.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const firebase = new Firebase();

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.query;

  const category = (
    await firebase.getDocumentsById<Category>("categories", [id as string])
  )[0];

  if (!category) {
    return {
      notFound: true
    };
  }

  const subcategories = await firebase.getDocumentsById<SubCategory>(
    "subcategories",
    categoriesToSubCategoryIds([category])
  );

  return { props: { subcategories, category } };
};

export default CategoryPage;
