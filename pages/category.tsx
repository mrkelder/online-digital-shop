import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import MetaHead from "components/meta/MetaHead";
import useLanguage from "hooks/useLanguage";
interface Props {
  category: Category;
}

const CategoryPage: NextPage<Props> = ({ category }) => {
  const { langVariant } = useLanguage();
  const name = langVariant(category.name.ua, category.name.ru);

  return (
    <div>
      <MetaHead title={name} noindex />

      <h1>{name}</h1>
      <ul>
        {category.subCategories.map(i => (
          <li key={i._id} className="bg-white px-5 py-2.5 shadow-xl mb-2">
            <Link href={`/catalog?subCategoryId=${i._id}`}>
              <a className="text-2xl">{langVariant(i.name.ua, i.name.ru)}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.query;

  if (id) {
    const categoryFetch = await fetch(
      process.env.NEXT_PUBLIC_HOSTNAME + "/api/getCategory/" + id
    );
    const category = (await categoryFetch.json()) as Category;
    return { props: { category } };
  }

  return { notFound: true };
};

export default CategoryPage;
