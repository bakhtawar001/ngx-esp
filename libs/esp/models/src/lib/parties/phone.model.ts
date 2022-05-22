export const enum PhoneTypeEnum {
  Mobile = 'Mobile',
  Office = 'Office',
  OfficeFax = 'OfficeFax',
  OrdersFax = 'OrdersFax',
  Other = 'Other',
}

export interface Phone {
  Id?: number;
  Type: PhoneTypeEnum;
  PhoneCode: string;
  Country: string; // CountryTypeEnum;
  Number: string;
  Extension?: string;
  IsPrimary?: boolean;
}
