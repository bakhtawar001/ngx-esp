import { Injectable } from '@angular/core';
import {
  OperationStatus,
  optimisticUpdate,
  syncLoadProgress,
} from '@cosmos/state';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SettingsActions } from '../actions';
import { Setting } from '../models';
import { SettingCode } from '../models/setting-code';
import { SettingsService } from '../services/settings.service';

export interface SettingsStateModel {
  settings: { [type: string]: Setting };
  loading?: OperationStatus;
}

type LocalStateContext = StateContext<SettingsStateModel>;

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    settings: null,
  },
})
@Injectable()
export class SettingsState {
  constructor(private readonly _service: SettingsService) {}

  @Action(SettingsActions.LoadSettings)
  loadSettings(ctx: LocalStateContext) {
    return this._service.settings().pipe(
      tap((data) => {
        const settings = {};
        data.forEach((setting) => {
          settings[setting.Type] = setting;
        });
        ctx.patchState({ settings });
      }),
      syncLoadProgress(ctx, {
        errorMessage: 'Could not sucessfully retrieve settings from profile.',
      }),
      catchError(() => EMPTY)
    );
  }

  @Action(SettingsActions.UpdateSetting)
  updateSetting(
    ctx: LocalStateContext,
    { group, key, values }: SettingsActions.UpdateSetting
  ) {
    const code = (group ? `${group}.${key}` : key) as SettingCode;

    const setting = ctx.getState().settings?.[code];
    const updatedSetting = { ...setting, ...values };

    return this._service.updateSetting(code, updatedSetting).pipe(
      optimisticUpdate(updatedSetting, {
        getValue: () => ctx.getState().settings?.[code],
        setValue: (value) =>
          ctx.setState(
            patch({
              settings: patch({
                [code]: value,
              }),
            })
          ),
      })
    );
  }
}
