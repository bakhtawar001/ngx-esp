import { Party } from './party.model';

// TODO: types
export interface LinkedCompany {
  Company: any;
  Relationship: any;
}

export interface LinkRelationshipType {
  Id: number;
  Code: string;
  Forward?: string;
  ForwardTitle: string;
  Reverse?: string;
  ReverseTitle: string;
  ForPerson: boolean;
  ForCompany: boolean;
  IsEditable?: boolean;
}

export interface LinkRelationship {
  Id: number;
  Comment: string;
  Title: string;
  Type: LinkRelationshipType;
  IsEditbale: boolean;
  To?: Partial<Party>;
  From?: Partial<Party>;
  Reverse?: boolean;
}

export interface Relationship {
  Id: number;
  Name: string;
  Code: string;
  LinkID: number;
  Reverse: boolean;
  ForwardTitle: string;
  ReverseTitle: string;
  ForCompany: boolean;
  ForPerson: boolean;
}
