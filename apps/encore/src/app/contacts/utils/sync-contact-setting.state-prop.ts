import { createAppSettingsPropHandlerFor } from '@cosmos/core';
import { ContactsSettings } from '../models';

export const syncContactsSetting = createAppSettingsPropHandlerFor<ContactsSettings>(
  'companies'
);
