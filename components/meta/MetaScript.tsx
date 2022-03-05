import { FC } from "react";

import Script from "next/script";

interface Props {
  id: string;
}

const MetaScript: FC<Props> = ({ children, id }) => {
  return (
    <Script id={id} type="application/ld+json">
      {children}
    </Script>
  );
};

export default MetaScript;
