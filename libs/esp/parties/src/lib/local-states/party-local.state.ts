import { InjectionToken } from '@angular/core';
import { LocalState } from '@cosmos/state';
import { PartyBase, Project } from '@esp/models';

export const PARTY_LOCAL_STATE = new InjectionToken<PartyLocalState>(
  'ESP Party Local State'
);

export abstract class PartyLocalState<
  T extends object = any
> extends LocalState<T> {
  abstract party: PartyBase | Project;
  abstract partyIsReady: boolean;
  abstract save(party: Partial<PartyBase> | Partial<Project>): void;
}
