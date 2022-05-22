import { InjectionToken } from '@angular/core';
import { LocalState } from '@cosmos/state';
import { FinancialDetails } from '../models';
import { FinancialDetailsLookups } from '../models';

export const FINANCIAL_DETAILS_LOCAL_STATE =
  new InjectionToken<FinancialDetailsLocalState>(
    'ASI Financial Details Local State'
  );

export abstract class FinancialDetailsLocalState<
  T extends object = any
> extends LocalState<T> {
  abstract party: FinancialDetails;
  abstract partyLookups: FinancialDetailsLookups;
  abstract partyIsReady: boolean;
  abstract save(data: Partial<FinancialDetails>): void;
}
