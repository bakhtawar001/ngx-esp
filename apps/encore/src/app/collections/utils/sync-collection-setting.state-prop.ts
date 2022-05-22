import { createAppSettingsPropHandlerFor } from '@cosmos/core';
import { CollectionsSettings } from '../models';

export const syncCollectionsSetting = createAppSettingsPropHandlerFor<CollectionsSettings>(
  'collections'
);
