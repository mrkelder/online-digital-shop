type ReadCookieReturnValue = string | undefined;

class Cookie {
  // TODO: test (JEST)

  private static COOKIE_CONF = "max-age=31536000; path=*";

  public static setCookie(fieldName: string, value: string): void {
    const filedNameIsInvalid = typeof fieldName !== "string";
    const valueIsInvalid = typeof value !== "string";

    if (valueIsInvalid || filedNameIsInvalid) {
      throw new Error("Cookie: filed name or value is not valid");
    }

    if (value.replaceAll(" ", "").match(/[\W\D]/g) !== null) {
      throw new Error(
        "Cookie: improper cookie value, please use only words and numbers"
      );
    }

    if (Cookie._isCookieAvailbale()) {
      Cookie._setCookie(fieldName, value);
    }
  }

  private static _setCookie(fieldName: string, value: string): void {
    document.cookie = `${fieldName}=${value}; ${Cookie.COOKIE_CONF};`;
  }

  public static readCookie(fieldName: string): ReadCookieReturnValue {
    if (Cookie._isCookieAvailbale()) return Cookie._readCookie(fieldName);
    else undefined;
  }

  private static _readCookie(fieldName: string): ReadCookieReturnValue {
    const cookies = document.cookie;
    const regExp = new RegExp(`${fieldName}=[\\d\\w]*`);
    const result = cookies.match(regExp);

    if (result) {
      return result[0].split("=")[1];
    } else return undefined;
  }

  public static returnDeleteCookieConf(field: string): string {
    return `${field}=; path=*; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  private static _isCookieAvailbale(): boolean {
    try {
      if (window.document) return true;
      else return false;
    } catch {
      return false;
    }
  }
}

export default Cookie;
