import { BrandInformation } from '@esp/models';
import { CompanyInfoFormModel } from './company-info-form.model';

export interface CompanyFormModel {
  CompanyInformation: CompanyInfoFormModel;
  BrandInformation: BrandInformation;
}
