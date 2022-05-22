import { Injectable } from '@angular/core';
import { OperationStatus, syncLoadProgress } from '@cosmos/state';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DesignSettingsActions, SettingsActions } from '../actions';
import { DocumentSetting } from '../models';
import { DesignSettingsService } from '../services/design-settings.service';

export interface DesignSettingsStateModel {
  settings: DocumentSetting;
  loading?: OperationStatus;
}

type LocalStateContext = StateContext<DesignSettingsStateModel>;

@State<DesignSettingsStateModel>({
  name: 'designSettings',
  defaults: {
    settings: null,
  },
})
@Injectable()
export class DesignSettingsState {
  constructor(private readonly _service: DesignSettingsService) {}

  @Action([SettingsActions.LoadSettings, DesignSettingsActions.Load])
  loadSettings(ctx: LocalStateContext) {
    return this._service.get().pipe(
      tap((settings) => {
        ctx.patchState({
          settings,
        });
      }),
      syncLoadProgress(ctx, {
        errorMessage: 'Could not sucessfully retrieve design settings.',
      }),
      catchError(() => EMPTY)
    );
  }

  @Action(DesignSettingsActions.UpdateSetting)
  updateSetting(
    ctx: LocalStateContext,
    { key, value }: DesignSettingsActions.UpdateSetting
  ) {
    const { settings } = ctx.getState();

    const newState = {
      ...settings,
      ...{
        [key]: value as any,
      },
    };

    ctx.setState(
      patch({
        settings: newState,
      })
    );

    return this._service.save(newState).pipe(
      tap((settings) => {
        ctx.setState(
          patch({
            settings,
          })
        );
      }),
      catchError(() => {
        ctx.setState(
          patch({
            settings,
          })
        );
        return EMPTY;
      })
    );
  }
}
