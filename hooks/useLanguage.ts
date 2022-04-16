import { useRouter } from "next/router";

import queryObjectToURL from "functions/queryObjectToURL";

interface ReturnValue {
  changeLanguage: () => void;
  langVariant: (ua: string, ru: string) => string;
}

function useLanguage(): ReturnValue {
  const { locale, push, pathname, query } = useRouter();
  const isUA = locale === "ua";

  function changeLanguage() {
    const queryString = queryObjectToURL(query);
    const totalURL = pathname + queryString;
    push(totalURL, totalURL, { locale: isUA ? "ru" : "ua" });
  }

  function langVariant(ua: string, ru: string): string {
    return isUA ? ua : ru;
  }

  return {
    changeLanguage,
    langVariant
  };
}

export default useLanguage;
