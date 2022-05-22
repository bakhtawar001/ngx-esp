import { LinkRelationship, Party } from '../parties';

export interface Contact extends Party {
  GivenName: string;
  FamilyName: string;
  IsUser: boolean;
  IsSalesPerson: boolean;
  IsProspect: boolean;
  Title: string;
  Notes?: any[];
  Links: LinkRelationship[];
}
