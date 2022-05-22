import { Shareable } from '../common';
import { MediaLink } from '../orders';
import { Address } from './address.model';
import { Email } from './email.model';
import { Party } from './party.model';
import { Phone } from './phone.model';
import { Website } from './website.model';

export interface PartyBase extends Shareable {
  Creator: Party;
  Websites: Website[];
  Emails: Email[];
  Phones: Phone[];
  Addresses: Address[];
  Tags: string[];
  Version: number;
  LastActivityDate: string;
  UpdateDate: string;
  CreateDate: string;
  ProfileImageUrl: string;
  IsActive: boolean;
  Name: string;
  Id: number;
  ExternalId: number;
  ExternalRecordId: string;
  IconMediaLink?: MediaLink;
  LogoMediaLink?: MediaLink;
}
