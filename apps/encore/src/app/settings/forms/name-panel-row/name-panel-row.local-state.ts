import { InjectionToken } from '@angular/core';
import { LocalState } from '@cosmos/state';
import { User } from '@esp/auth';
import { Contact } from '@esp/models';

type Data = Contact | User;

export const NAME_PANEL_LOCAL_STATE =
  new InjectionToken<NamePanelRowLocalState>('ESP Name Panel Local State');

export abstract class NamePanelRowLocalState extends LocalState<never> {
  abstract data: Data;
  abstract updateName(data: Partial<Data>): void;
}
