export * from './object-proxify';

export class Utils {
  public static filterArrayByString<T>(mainArr: T[], searchText: string): any {
    if (searchText === '') {
      return mainArr;
    }

    searchText = searchText.toLowerCase();

    return mainArr.filter((itemObj) =>
      this.searchInObject(itemObj, searchText)
    );
  }

  public static searchInObject(itemObj: any, searchText: string): boolean {
    for (const prop in itemObj) {
      if (!itemObj.hasOwnProperty(prop)) {
        continue;
      }

      const value = itemObj[prop];

      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      } else if (Array.isArray(value)) {
        if (this.searchInArray(value, searchText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObject(value, searchText)) {
          return true;
        }
      }
    }

    return false;
  }

  public static searchInArray<T>(arr: T[], searchText: string): boolean {
    for (const value of arr) {
      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObject(value, searchText)) {
          return true;
        }
      }
    }

    return false;
  }

  public static searchInString(value: string, searchText: string): boolean {
    return value.toLowerCase().includes(searchText);
  }
}
