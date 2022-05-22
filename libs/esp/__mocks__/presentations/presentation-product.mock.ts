import { produce } from 'immer';

import { PresentationProduct } from '@esp/models';

const MOCK_PRESENTATION_PRODUCT: PresentationProduct = {
  Id: 500000094,
  ProductId: 553064391,
  IsVisible: false,
  ShowMinMaxRange: true,
  AdjustmentType: 'profit-margin',
  Adjustment: 0,
  RoundPricesToTwoDecimal: true,
  Sequence: 7,
  Supplier: { AsiSupplierId: 593, Id: 0 },
  Like: 'None',
  Name: 'Cap America Cable Knit',
  Description:
    'Top off a great branded campaign with one of our stylish quality caps! This Cap America winter hat is crafted from a soft and warm polyester, cotton and spandex blend. It has a cable knit design with a fleece ear band and a faux fur pom-pom on top. Choose from four cool colors and add your school, sports team, organizational or company logo, emblem or message to create a sporty branded gift or giveaway for marketing and social activities and events.',
  Summary:
    'Cap America polyester/cotton/spandex cable knit cap with faux fur pom-pom.',
  Number: '26208',
  DefaultMedia: {
    IsVisible: false,
    Sequence: 0,
    Id: 42781923,
    Type: 'IM',
    Url: 'https://media.asicdn.com/images/jpgo/42780000/42781923.jpg',
    IsPrimary: true,
    IsVirtualSampleReady: false,
    Attributes: [839937094],
    IsAvailable: false,
  },
  LowestPrice: {
    IsVisible: false,
    Sequence: 0,
    Price: 16.9,
    Cost: 8.45,
    DiscountCode: 'P',
    DiscountPercent: 0.5,
    CurrencyCode: 'USD',
    IsUndefined: false,
    Quantity: { From: 1296, To: 2147483647 },
  },
  HighestPrice: {
    IsVisible: false,
    Sequence: 0,
    Price: 17.7,
    Cost: 8.85,
    DiscountCode: 'P',
    DiscountPercent: 0.5,
    CurrencyCode: 'USD',
    IsUndefined: false,
    Quantity: { From: 48, To: 95 },
  },
  UpdateDate: '2021-07-02T23:38:40.357Z',
  PublishDate: '2021-07-02T19:38:40.84Z',
  Media: [],
  Attributes: [],
  PriceGrids: [],
  Charges: [],
  Currencies: [],
};

export function mockPresentationProduct(
  recipe?: (product: PresentationProduct) => PresentationProduct
): PresentationProduct {
  return recipe
    ? produce(MOCK_PRESENTATION_PRODUCT, recipe)
    : MOCK_PRESENTATION_PRODUCT;
}
