import { Company } from '@esp/models';

export interface CreateCompanyPayload extends Partial<Company> {
  GivenName: string;
  FamilyName: string;
}
