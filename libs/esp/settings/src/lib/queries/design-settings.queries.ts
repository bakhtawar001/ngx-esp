import { createLoadingSelectorsFor, createSelectorX } from '@cosmos/state';
import { DesignSettingCode } from '../models';
import { DesignSettingsState, DesignSettingsStateModel } from '../states';

export namespace DesignSettingsQueries {
  export const {
    isLoading,
    hasLoaded,
    getLoadError,
  } = createLoadingSelectorsFor<DesignSettingsStateModel>(DesignSettingsState);

  export const getDesignSettings = createSelectorX(
    [DesignSettingsState],
    (state: DesignSettingsStateModel) => state.settings
  );

  export const getSettingFn = createSelectorX(
    [getDesignSettings],
    (settings) => (settingCode: DesignSettingCode) => settings?.[settingCode]
  );
}
