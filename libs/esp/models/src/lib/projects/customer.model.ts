import { Address } from '../parties';

export interface Customer {
  Id: number;
  Name?: string;
  IconImageUrl?: string;
  PrimaryBrandColor?: string;
  LogoImageUrl?: string;
  PrimaryAddress?: Address;
  PrimaryEmail?: string;
  PrimaryPhone?: string;
  Types?: string[];
}
