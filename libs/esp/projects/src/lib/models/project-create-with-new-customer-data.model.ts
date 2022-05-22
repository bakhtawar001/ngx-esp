import { CompanyFormModel } from '@asi/company/ui/feature-core';
import { ProjectDetailsForm } from './project-details-form.model';

export interface ProjectCreateWithNewCustomer {
  customer: CompanyFormModel;
  project: ProjectDetailsForm;
  productIds: number[];
}
