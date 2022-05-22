export interface EspUserProfile {
  Id: number;
  Name: string;
  GivenName: string;
  FamilyName: string;
  CompanyName: string;
  AsiNumber: string;
  GravatarHash: string;
  Permissions: string[];
  CompanyId?: number;
  IsAdmin: boolean;
  UserName: string;
  ContactId: number;
  LoginEmail?: string;
  Email: string;
  TenantId: number;
}
