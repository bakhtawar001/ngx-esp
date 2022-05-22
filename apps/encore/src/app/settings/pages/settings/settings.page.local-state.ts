import { Injectable } from '@angular/core';
import { asDispatch, fromSelector, LocalState } from '@cosmos/state';
import { DesignSettingsQueries, SettingsActions } from '@esp/settings';

@Injectable()
export class SettingsPageLocalState extends LocalState<SettingsPageLocalState> {
  isLoading = fromSelector(DesignSettingsQueries.isLoading);
  hasLoaded = fromSelector(DesignSettingsQueries.hasLoaded);

  loadSettings = asDispatch(SettingsActions.LoadSettings);
}
