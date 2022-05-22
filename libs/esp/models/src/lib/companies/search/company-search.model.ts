import { PartySearch } from '../../parties';

export interface CompanySearch extends PartySearch {
  Types: string[];
  AsiNumber: string[];
  CanEditVisibility: boolean;
  WebsiteContactCount: number;
  PrimaryBrandColor?: string;
}
