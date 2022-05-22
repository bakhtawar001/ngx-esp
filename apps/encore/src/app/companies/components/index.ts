import { CompanyActivityComponentModule } from './company-activity';
import { CompanyArtworkComponentModule } from './company-artwork';
import { CompanyContactsComponentModule } from './company-contacts';
import { CompanyDecorationsComponentModule } from './company-decorations';
import { CompanyDetailComponentModule } from './company-detail';
import { CompanyNotesComponentModule } from './company-notes';
import { CompanyProductHistoryComponentModule } from './company-product-history';

export const COMPANY_DETAIL_MODULES = [
  CompanyActivityComponentModule,
  CompanyDetailComponentModule,
  CompanyProductHistoryComponentModule,
  CompanyNotesComponentModule,
  CompanyArtworkComponentModule,
  CompanyDecorationsComponentModule,
  CompanyContactsComponentModule,
];
