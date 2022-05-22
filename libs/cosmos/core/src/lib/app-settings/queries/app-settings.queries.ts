import { createSelectorX } from '@cosmos/state';
import {
  AppSettingsState,
  AppSettingsStateModel,
} from '../states/app-settings.state';

export namespace AppSettingsQueries {
  function createAppFeatureSettingsSelectorFor<TFeatureSettingType>(
    featureSettingName: string
  ) {
    return createSelectorX(
      [AppSettingsState],
      (state: AppSettingsStateModel) =>
        state.settings[featureSettingName] as TFeatureSettingType
    );
  }

  export function getAppFeatureSettingPropValueFor<
    TFeatureSettingType extends object,
    TKey extends keyof TFeatureSettingType
  >(featureSettingName: string, prop: TKey) {
    type PropValueType = TFeatureSettingType[TKey];
    return createSelectorX(
      [
        createAppFeatureSettingsSelectorFor<TFeatureSettingType>(
          featureSettingName
        ),
      ],
      (featureSettings) => featureSettings?.[prop]
    );
  }
}
