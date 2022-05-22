import { PartyBase } from './party-base.model';

export interface Party extends PartyBase {
  IsCompany?: boolean;
  IsPerson?: boolean;
}
