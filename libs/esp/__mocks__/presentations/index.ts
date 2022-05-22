import { Presentation } from '@esp/models';
import * as faker from 'faker/locale/en_US';
import { CompaniesMockDb } from '../companies';

const mockPresentation = (): Presentation => ({
  Id: faker.datatype.number(),
  ProjectId: faker.datatype.number(),
  IsDeleted: false,
  Customer: CompaniesMockDb.Companies[0],
  Settings: {
    ShowProductColors: false,
    ShowProductSizes: false,
    ShowProductShape: false,
    ShowProductMaterial: false,
    ShowProductCPN: false,
    ShowProductImprintMethods: false,
    ShowProductPricing: false,
    ShowProductPriceGrids: false,
    ShowProductPriceRanges: false,
    ShowProductAdditionalCharges: false,
  },
  CreateDate: faker.date.past().toISOString(),
  UpdateDate: null,
  Note: null,
  ExpirationDate: null,
  Status: null,
  LastViewDate: null,
  SharedDate: null,
  NumberOfProductsDisliked: 0,
  NumberOfProductsQuoted: 0,
  Products: [],
  TenantId: faker.datatype.number(),
  OwnerId: faker.datatype.number(),
  Access: [],
  AccessLevel: 'Owner',
  IsVisible: false,
  IsEditable: false,
  AllowProductVariants: false,
  ShowSignature: false,
});

export class PresentationMockDb {
  static get presentation(): Presentation {
    return mockPresentation();
  }
}

export * from './product.mock';
export * from './presentation-product.mock';
