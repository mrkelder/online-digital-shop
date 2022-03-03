import { FC } from "react";

import Head from "next/head";

interface Props {
  title?: string;
  keywords?: string;
  description?: string;
  author?: string;
  image?: string;
}

const SITE_NAME = "New London";

const MetaHead: FC<Props> = ({
  title,
  keywords,
  description,
  author,
  image
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta name="author" content={author} />

      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      <meta property="og:url" content="/" />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={title} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image:alt" content="Логотип" />
    </Head>
  );
};

MetaHead.defaultProps = {
  title: SITE_NAME,
  keywords:
    "Бытовая техника, мобильные телефоны, телевизоры, кондиционеры, холодильники, мониторы, ноутбуки с доставкой",
  description:
    "Бытовая техника, мобильные телефоны, телевизоры, кондиционеры, холодильники, мониторы, ноутбуки с доставкой",
  author: SITE_NAME,
  image: "/logo_cover.png"
};

export default MetaHead;
