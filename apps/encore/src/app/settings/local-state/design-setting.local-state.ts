import { Inject, Injectable, InjectionToken } from '@angular/core';
import { asDispatch, fromSelector, LocalState } from '@cosmos/state';
import {
  DesignSettingCode,
  DesignSettingsActions,
  DesignSettingsQueries,
} from '@esp/settings';

const DESIGN_SETTING_CODE_TOKEN = new InjectionToken<DesignSettingCode>(
  '[DesignSettings] Setting Code Token'
);

@Injectable()
export class DesignSettingLocalState extends LocalState<DesignSettingLocalState> {
  private getSetting = fromSelector(DesignSettingsQueries.getSettingFn);
  private updateSetting = asDispatch(DesignSettingsActions.UpdateSetting);

  hasLoaded = fromSelector(DesignSettingsQueries.hasLoaded);
  isLoading = fromSelector(DesignSettingsQueries.isLoading);

  static forComponent(options: { settingCode: DesignSettingCode }) {
    return [
      DesignSettingLocalState,
      { provide: DESIGN_SETTING_CODE_TOKEN, useValue: options.settingCode },
    ];
  }

  constructor(
    @Inject(DESIGN_SETTING_CODE_TOKEN) private _settingCode: DesignSettingCode
  ) {
    super();
  }

  get value() {
    return this.getSetting?.(this._settingCode);
  }

  save(value: any) {
    this.updateSetting(this._settingCode, value);
  }
}
