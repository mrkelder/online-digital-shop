type GetItemReturnValue = string | null;

class LocalStorage {
  // TODO: JEST

  public setItem(fieldName: string, name: unknown): void {
    if (typeof fieldName !== "string") {
      throw new Error("LocalStorage: filed name is invalid");
    }

    if (LocalStorage._isLocalStorageAvailbale()) {
      this._setItem(fieldName, JSON.stringify(name));
    }
  }

  private _setItem(fieldName: string, name: string): void {
    localStorage.setItem(fieldName, name);
  }

  public getItem(fieldName: string): GetItemReturnValue {
    if (LocalStorage._isLocalStorageAvailbale()) {
      return this._getItem(fieldName);
    } else {
      return null;
    }
  }

  private _getItem(fieldName: string): GetItemReturnValue {
    return localStorage.getItem(fieldName);
  }

  public removeItem(fieldName: string): void {
    if (LocalStorage._isLocalStorageAvailbale()) {
      this._removeItem(fieldName);
    }
  }

  private _removeItem(fieldName: string): void {
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
