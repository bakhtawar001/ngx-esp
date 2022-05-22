import { Injectable } from '@angular/core';
import { NavigationStart } from '@angular/router';
import { BrowserStorageService } from '@cosmos/core';
import { ProjectSearchFilters } from '@esp/projects';

const StorageKeys = {
  FiltersKey: 'CompanyProjectsFilters',
  FromKey: 'CompanyProjectsFrom',
  TermKey: 'CompanyProjectsTerm',
};

@Injectable()
export class CompanyProjectsFiltersCacheService {
  readonly filtersConverter = {
    fromQuery: (
      queryParameterValues: string[],
      defaultValue: ProjectSearchFilters
    ) => {
      let valueToSet = defaultValue;
      const cachedFilters = this.browserStorage.get(StorageKeys.FiltersKey);

      if (cachedFilters) {
        valueToSet = JSON.parse(decodeURIComponent(cachedFilters));
      } else if (queryParameterValues.length) {
        valueToSet = JSON.parse(decodeURIComponent(queryParameterValues[0]));
      }

      return valueToSet;
    },
    toQuery: (value: ProjectSearchFilters) => {
      const values = value
        ? Object.entries(value).filter(([_, v]) => v != null)
        : [];

      if (!values.length) {
        this.browserStorage.set(StorageKeys.FiltersKey, null);
        return [];
      }

      const valueToSet = encodeURIComponent(
        JSON.stringify(Object.fromEntries(values))
      );
      this.browserStorage.set(StorageKeys.FiltersKey, valueToSet);

      return [valueToSet];
    },
  };
  readonly fromConverter = {
    fromQuery: (queryParameterValues: string[], defaultValue: number) => {
      const cachedFrom = this.browserStorage.get(StorageKeys.FromKey);

      if (cachedFrom) {
        return parseInt(cachedFrom, 10);
      }

      return queryParameterValues?.length > 0
        ? parseInt(queryParameterValues[0], 10)
        : defaultValue;
    },
    toQuery: (value: number) => {
      if (value <= 1) {
        this.browserStorage.set(StorageKeys.FromKey, value.toString());
        return [];
      }

      this.browserStorage.set(StorageKeys.FromKey, value.toString());

      return [value.toString()];
    },
  };
  readonly termConverter = {
    fromQuery: (queryParameterValues: string[]) => {
      const cachedTerm = this.browserStorage.get(StorageKeys.TermKey);

      if (cachedTerm) {
        return cachedTerm;
      }

      return queryParameterValues?.[0];
    },
    toQuery: (value: string) => {
      if (!value) {
        this.browserStorage.set(StorageKeys.TermKey, '');
        return [];
      }

      this.browserStorage.set(StorageKeys.TermKey, value);

      return [value];
    },
  };

  constructor(private readonly browserStorage: BrowserStorageService) {}

  clear(): void {
    this.browserStorage.set(StorageKeys.FiltersKey, null);
    this.browserStorage.set(StorageKeys.FromKey, '0');
    this.browserStorage.set(StorageKeys.TermKey, '');
  }

  checkIfShouldClear(navigationStart: NavigationStart): boolean {
    return (
      !navigationStart.url.includes('directory') &&
      !navigationStart.url.includes('companies')
    );
  }
}
