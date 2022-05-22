import { Presentation, PresentationStatus } from '@esp/models';

export const generatePresentation = (data?: {}): Presentation => ({
  Id: 5000,
  ProjectId: 2000,
  IsDeleted: false,
  Settings: {
    ShowProductColors: true,
    ShowProductSizes: true,
    ShowProductShape: true,
    ShowProductMaterial: true,
    ShowProductCPN: true,
    ShowProductImprintMethods: true,
    ShowProductPricing: true,
    ShowProductPriceGrids: true,
    ShowProductPriceRanges: true,
    ShowProductAdditionalCharges: true,
  },
  AllowProductVariants: false,
  ShowSignature: true,
  CreateDate: '2021-12-10T15:16:53.41',
  Status: PresentationStatus.PreShare,
  NumberOfProductsDisliked: 0,
  NumberOfProductsQuoted: 0,
  Products: [],
  TenantId: 500049971,
  OwnerId: 134577,
  AccessLevel: 'Everyone',
  Access: [{ AccessLevel: 'Everyone', EntityId: 0, AccessType: 'ReadWrite' }],

  ...data,
});
