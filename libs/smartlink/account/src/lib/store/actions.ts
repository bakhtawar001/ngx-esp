import { Search, AccountInformation, AccountPreference } from '../models';

export class LoadSearchesSuccess {
  static type = '[Account] LoadSearchesSuccess';
  constructor(public searches: Search[]) {}
}

export class LoadAccountInformationSuccess {
  static type = '[Account] LoadAccountInformationSuccess';
  constructor(public info: AccountInformation) {}
}

export class LoadAccountPreferenceSuccess {
  static type = '[Account] LoadAccountPreferenceSuccess';
  constructor(public preference: AccountPreference) {}
}

export class UpdateAccountInformationSuccess {
  static type = '[Account] UpdateAccountInformationSuccess';
  constructor(public info: AccountInformation) {}
}

export class UpdateAccountPreferenceSuccess {
  static type = '[Account] UpdateAccountPreferenceSuccess';
  constructor(public preference: AccountPreference) {}
}
