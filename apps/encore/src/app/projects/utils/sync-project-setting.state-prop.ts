import { createAppSettingsPropHandlerFor } from '@cosmos/core';
import { ProjectsSettings } from '../models';

export const syncProjectsSetting = createAppSettingsPropHandlerFor<ProjectsSettings>(
  'projects'
);
