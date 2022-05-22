import { Company, Contact } from '@esp/models';

export interface CreateCompanyDialogData {
  companyId?: number;
  type?: string;
}

export type CreateCompanyDialogResult = Company | Contact;
