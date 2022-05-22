import { Inject, Injectable, InjectionToken } from '@angular/core';
import { asDispatch, fromSelector, LocalState } from '@cosmos/state';
import { SettingsActions, SettingsQueries } from '@esp/settings';
import { SettingCode } from '@esp/settings';

const SETTING_CODE_TOKEN = new InjectionToken<SettingCode>(
  '[Settings] Setting Code Token'
);

@Injectable()
export class SettingLocalState extends LocalState<SettingLocalState> {
  private getSetting = fromSelector(SettingsQueries.getSettingFn);
  private updateSetting = asDispatch(SettingsActions.UpdateSetting);

  hasLoaded = fromSelector(SettingsQueries.hasLoaded);
  isLoading = fromSelector(SettingsQueries.isLoading);

  static forComponent(options: { settingCode: SettingCode }) {
    return [
      SettingLocalState,
      { provide: SETTING_CODE_TOKEN, useValue: options.settingCode },
    ];
  }

  constructor(@Inject(SETTING_CODE_TOKEN) private _settingCode: SettingCode) {
    super();
  }

  get value() {
    return this.getSetting?.(this._settingCode)?.Value;
  }

  save(value: string) {
    this.updateSetting(this._settingCode, { Value: value });
  }
}
