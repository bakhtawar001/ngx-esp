import { Search, AccountInformation } from '../models';

export interface AccountStateModel {
  searches: Search[];
  info: AccountInformation | null;
  preferences: {
    [Item: string]: string;
  };
}
