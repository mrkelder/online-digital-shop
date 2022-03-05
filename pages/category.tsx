import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import MetaHead from "components/meta/MetaHead";
import categoriesToSubCategoryIds from "utils/dto/categoriesToSubCategoryIds";
import Firebase from "utils/firebase";

interface Props {
  category: Category;
  subcategories: SubCategory[];
}

const CategoryPage: NextPage<Props> = ({ category, subcategories }) => {
  return (
    <div>
      <MetaHead title={category.name} noindex />

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
