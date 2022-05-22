import { Injectable } from '@angular/core';
import { mergeState } from '@cosmos/state';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { AppSettingsActions } from '../actions';

export type AppSettingsStateModel = { settings: Record<string, any> };

export type LocalStateContext = StateContext<AppSettingsStateModel>;

@State<AppSettingsStateModel>({
  name: 'appSettings',
  defaults: {
    settings: {},
  },
})
@Injectable()
export class AppSettingsState {
  @Action(AppSettingsActions.SetValue)
  Set(
    ctx: LocalStateContext,
    { featureSettingName, prop, value }: AppSettingsActions.SetValue<any>
  ) {
    ctx.setState(
      mergeState({ settings: { [featureSettingName]: { [prop]: value } } })
    );
  }
}
