type ReadCookieReturnValue = string | undefined;

class Cookie {
  private static COOKIE_CONF = "max-age=31536000; path=*";

  public setCookie(fieldName: string, value: string): void {
    // TODO: test (JEST)
    if (value.replaceAll(" ", "").match(/[\W\D]/g) !== null) {
      throw new Error(
        "Cookie: improper cookie value, please use only words and numbers"
      );
    }
    if (Cookie._isCookieAvailbale()) {
      this._setCookie(fieldName, value);
    }
  }

  private _setCookie(fieldName: string, value: string): void {
    document.cookie = `${fieldName}=${value}; ${Cookie.COOKIE_CONF};`;
  }

  public readCookie(fieldName: string): ReadCookieReturnValue {
    if (Cookie._isCookieAvailbale()) return this._readCookie(fieldName);
    else undefined;
  }

  private _readCookie(fieldName: string): ReadCookieReturnValue {
    const cookies = document.cookie;
    const regExp = new RegExp(`${fieldName}=[\\d\\w]*`);
    const result = cookies.match(regExp);

    if (result) {
      return result[0].split("=")[1];
    } else return undefined;
  }

  public returnDeleteCookieConf(field: string): string {
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
