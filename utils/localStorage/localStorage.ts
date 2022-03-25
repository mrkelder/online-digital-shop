type GetItemReturnValue = string | null;

class LocalStorage {
  // TODO: JEST

  public static setItem(fieldName: string, name: unknown): void {
    if (typeof fieldName !== "string") {
      throw new Error("LocalStorage: filed name is invalid");
    }

    if (LocalStorage._isLocalStorageAvailbale()) {
      LocalStorage._setItem(fieldName, JSON.stringify(name));
    }
  }

  private static _setItem(fieldName: string, name: string): void {
    localStorage.setItem(fieldName, name);
  }

  public static getItem(fieldName: string): GetItemReturnValue {
    if (LocalStorage._isLocalStorageAvailbale()) {
      return LocalStorage._getItem(fieldName);
    } else {
      return null;
    }
  }

  private static _getItem(fieldName: string): GetItemReturnValue {
    return localStorage.getItem(fieldName);
  }

  public static removeItem(fieldName: string): void {
    if (LocalStorage._isLocalStorageAvailbale()) {
      LocalStorage._removeItem(fieldName);
    }
  }

  private static _removeItem(fieldName: string): void {
    localStorage.removeItem(fieldName);
  }

  private static _isLocalStorageAvailbale(): boolean {
    try {
      if (window.localStorage) return true;
      else return false;
    } catch {
      return false;
    }
  }
}

export default LocalStorage;
