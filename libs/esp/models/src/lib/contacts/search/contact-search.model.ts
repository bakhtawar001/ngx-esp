import { Company } from '../../companies';
import { PartySearch } from '../../parties';

export interface ContactSearch extends PartySearch {
  FirstName: string;
  LastName: string;
  IsSalesperson: boolean;
  IsUser: boolean;
  LastNameFirstCharacter: string;
  ExternalRecordId: string;
  UserId: number;
  IsWebsiteAdmin: boolean;
  WebsiteCredits: number;
  WebsiteCreditLimit: number;
  TenantName: string;
  TenantAsiNumber: string;
  Title: string;
  Companies?: Company[];
}
