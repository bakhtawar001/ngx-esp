import { createAppSettingsPropHandlerFor } from '@cosmos/core';

interface Categories {
  value: string;
  text: string;
}

export interface GlobalSearchConfig {
  input: string;
  category: string;
  button: string;
  categories: Array<Categories>;
}

export interface GlobalSearchSettings {
  searchType?: string;
  term?: string;
}

export const syncGlobalSearchSetting =
  createAppSettingsPropHandlerFor<GlobalSearchSettings>('globalSearch');
