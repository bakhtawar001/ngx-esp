import { createAppSettingsPropHandlerFor } from '@cosmos/core';
import { CompaniesSettings } from '../models';

export const syncCompaniesSetting = createAppSettingsPropHandlerFor<CompaniesSettings>(
  'companies'
);
