import { useRouter } from "next/router";

import queryObjectToURL from "functions/queryObjectToURL";

interface ReturnValue {
  isUA: boolean;
  changeLanguage: () => void;
}

function useLanguage(): ReturnValue {
  const { locale, push, pathname, query } = useRouter();
  const isUA = locale === "ua";

  function changeLanguage() {
    const queryString = queryObjectToURL(query);
    const totalURL = pathname + queryString;
    push(totalURL, totalURL, { locale: isUA ? "ru" : "ua" });
  }

  return {
    isUA,
    changeLanguage
  };
}

export default useLanguage;
