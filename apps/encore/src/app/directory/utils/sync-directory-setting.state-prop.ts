import { createAppSettingsPropHandlerFor } from '@cosmos/core';
import type { SortOption } from '@esp/search';

type DirectorySetting = {
  directorySort: SortOption;
  filters: any;
  searchTabIndex: number;
};

export const syncDirectorySetting =
  createAppSettingsPropHandlerFor<DirectorySetting>('directory');
