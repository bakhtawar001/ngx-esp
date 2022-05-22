import { Price } from './price';

export interface Option {
  Name: string;
  Type?: string;
  Description?: string;
  Values?: Array<GroupValue | string>;
  Groups?: GroupValue[];
  Charges?: GroupValue[];
}

export interface GroupValue {
  Name: string;
  Values?: any;
  Description?: string;
  Charges?: Price[];
  Options?: any;
}
