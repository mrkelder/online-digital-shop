import { FC } from "react";

import Head from "next/head";

interface Props {
  title?: string;
  keywords?: string;
  description?: string;
  author?: string;
}

const SITE_NAME = "New London";

const MetaHead: FC<Props> = ({ title, keywords, description, author }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta name="author" content={author} />
    </Head>
  );
};

MetaHead.defaultProps = {
  title: SITE_NAME,
  keywords:
    "Бытовая техника, мобильные телефоны, телевизоры, кондиционеры, холодильники, мониторы, ноутбуки с доставкой",
  description:
    "Бытовая техника, мобильные телефоны, телевизоры, кондиционеры, холодильники, мониторы, ноутбуки с доставкой",
  author: SITE_NAME
};

export default MetaHead;
