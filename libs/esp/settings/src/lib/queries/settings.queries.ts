import { createLoadingSelectorsFor, createSelectorX } from '@cosmos/state';
import { SettingCode } from '../models/setting-code';
import { SettingsState, SettingsStateModel } from '../states';

export namespace SettingsQueries {
  export const {
    isLoading,
    hasLoaded,
    getLoadError,
  } = createLoadingSelectorsFor<SettingsStateModel>(SettingsState);

  export const getSettings = createSelectorX(
    [SettingsState],
    (state: SettingsStateModel) => state.settings
  );

  export const getSettingFn = createSelectorX(
    [getSettings],
    (settings) => (settingCode: SettingCode) => settings?.[settingCode]
  );
}
