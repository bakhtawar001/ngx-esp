import * as faker from 'faker/locale/en_US';

import { Product } from '@smartlink/models';

const mockProduct = (Id): Product => {
  return {
    Id: Id,
    Name: faker.commerce.productName(),
    Description: '',
    Number: '',
    ImageUrl: '',
    VirtualSampleImages: [
      {
        Id: 0,
        ImageUrl: '',
      },
    ],
    Warnings: [
      {
        Name: 'Product can cause exposure to both a carcinogen and a reproductive toxicant',
        Description:
          'PROP 65 WARNING: This product can expose you to chemicals like Lead',
        Warning:
          'Product can cause exposure to both a carcinogen and a reproductive toxicant',
        Type: 'PROP',
      },
      {
        Name: 'Product can cause exposure to both a carcinogen and a reproductive toxicant',
        Description:
          'PROP 65 WARNING: This product can expose you to chemicals like Lead',
        Warning:
          'Product can cause exposure to both a carcinogen and a reproductive toxicant',
        Type: 'SWCH',
      },
    ],
    Prices: [
      {
        Quantity: {
          From: 48,
          To: 143,
        },
        Price: 6.8,
        Cost: 3.4,
        DiscountCode: 'P',
        CurrencyCode: 'USD',
        IsQUR: false,
        PreferredPrice: 6.8,
      },
      {
        Quantity: {
          From: 144,
          To: 287,
        },
        Price: 6.7,
        Cost: 3.35,
        DiscountCode: 'P',
        CurrencyCode: 'USD',
        IsQUR: false,
        PreferredPrice: 6.7,
      },
    ],
    Origin: ['USA', 'Canada'],
    Shipping: {
      FOBPoints: {
        Values: [
          {
            Code: '$2HK',
            Name: 'Ontario,  CA 91761 USA',
            $index: 3,
          },
        ],
      },
      Options: {
        Values: [
          {
            Name: 'Drop Shipment',
            $index: 3,
          },
        ],
      },
      Weight: {
        Values: [
          'We are not responsible for the delay of any freight carrier or due to force majeure events.',
        ],
      },
      BillsByWeight: false,
      BillsBySize: false,
      PackageInPlainBox: false,
      Carriers: null,
      Dimensions: {
        Description: '10W 20L 60H',
        Length: '10',
        LengthUnit: 'inches',
        Width: '10',
        WidthUnit: 'inches',
        Height: '10',
        HeightUnit: 'inches',
      },
      ItemsPerPackage: 10,
      PackageUnit: 'Box',
    },
    Packaging: [
      {
        Name: 'Packaging',
        Groups: [
          {
            Name: 'Poly Bag',
          },
        ],
      },
    ],
    Certifications: [
      {
        Name: 'ISO Certified',
        Code: 'NOTE',
      },
    ],
    ProductionTime: [
      {
        Name: '3-7 business days',
        Description:
          'Embroidery - After all products, final approvals and deposits are received.',
        Days: 10,
      },
      {
        Name: '7-10 business days',
        Description:
          'Digital Print Heat Transfer / Full Color Print Vinyl Heat Transfer - After all products, final approvals and deposits are received.',
        Days: 12,
      },
      {
        Name: '10-13 business days',
        Description:
          'Screen Printed Plastisol Heat Transfer / Foil Transfer Print / Vinyl Applique Heat Transfer - After all products, final approvals and deposits are received.',
        Days: 14,
      },
    ],
    RushTime: [
      {
        Name: 'Rush',
        Description: 'Urgent',
        Days: 10,
      },
      {
        Name: 'Rush 2',
        Description: 'Urgent 2',
        Days: 10,
      },
    ],
    Attributes: {
      Colors: {
        Values: [
          {
            Code: 'BLCK',
            Name: 'Black 003',
            ImageUrl: 'media/29022724',
            Options: [],
          },
          {
            Code: 'DRBL',
            Name: 'Navy 004',
            ImageUrl: 'media/29022727',
            Options: [],
          },
          {
            Code: 'MERD',
            Name: 'Red 002',
            ImageUrl: 'media/29022721',
            Options: [],
          },
          {
            Code: 'FLBL',
            Name: 'Royal 001',
            ImageUrl: 'media/29022718',
            Options: [],
          },
          {
            Code: 'DRGR',
            Name: 'Charcoal Gray 025',
            ImageUrl: 'media/29022733',
            Options: [],
          },
          {
            Code: 'MEGR',
            Name: 'Gray 014',
            ImageUrl: 'media/29022730',
            Options: [],
          },
        ],
      },
      Sizes: {
        Values: [
          {
            Code: 'OTHE',
            Name: 'Standard',
            Options: [],
          },
        ],
      },
      Materials: {
        Values: [
          {
            Code: '$026',
            Name: 'Cotton',
            Options: [],
          },
        ],
      },
    },
    Supplier: {
      Id: 0,
      AsiNumber: '',
      Name: '',
      // Address: {
      //   City: faker.address.city(),
      //   State: faker.address.state(),
      //   Zip: faker.address.zipCode(),
      //   Country: faker.address.country(),
      // },
      Phone: {
        Primary: faker.phone.phoneNumber(),
      },
      Fax: {
        Primary: faker.phone.phoneNumber(),
      },
      Email: faker.internet.email(),
      Websites: [],
      // Products: faker.datatype.number(),
    },
    IsNew: false,
    IsConfirmed: false,
    ShortDescription: faker.lorem.sentence(),
    Numbers: [],
    Images: [],
    LineNames: ['Line Name 1', 'Line Name 2', 'Line name 3'],
    Catalog: {
      Id: 0,
      Name: '',
      Year: '',
      Asset: '',
      CompanyId: 0,
      ProductCount: 3,
      EndUserSafe: true,
      Pages: [],
    },
    Catalogs: [],
    Categories: [
      {
        Id: 'B02220003',
        Name: 'Six Panel',
        Parent: {
          Id: 'B02160003',
          Name: 'Baseball Caps',
        },
      },
      {
        Id: 'C01609903',
        Name: 'General',
        Parent: {
          Id: 'C01560003',
          Name: 'Caps \\u0026 Hats',
        },
      },
    ],
    TradeNames: ['Tade Name 1', 'Trade Name 2', 'Trade Name 3'],
    WarrantyInfo: {
      Values: [
        {
          Name: 'Warranty type 1',
          Description: 'This is the description of warranty type 1',
        },
        {
          Name: 'Warranty type 2',
          Description: 'This is the description of warranty type 2',
        },
      ],
    },
    BatteryInfo: {
      Values: [
        {
          Name: 'Battery type 1',
          Description: 'This is the description of Battery type 1',
        },
        {
          Name: 'Battery type 2',
          Description: 'This is the description of Battery type 2',
        },
      ],
    },
    Weight: {
      Values: ['1gm', '2gm'],
    },
    Imprinting: {
      Colors: {
        Values: [
          {
            Code: '$2HM',
            Name: 'Standard',
            Options: [],
          },
        ],
      },
      Methods: {
        Values: [
          {
            Code: '$UNI',
            Name: 'Unimprinted',
            Options: null,
          },
          {
            Code: '$0TM',
            Name: 'Embroidery',
            Options: null,
            Charges: [
              {
                TypeCode: 'DGCH',
                Type: 'Digitizing Charge',
                Description: 'Embroidery',
                Prices: [
                  {
                    Quantity: {
                      From: 1,
                      To: 2147483647,
                    },
                    Price: 13.333,
                    Cost: 8,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                ],
                PriceIncludes: 'per 1,000 stitches. ',
                IsRequired: true,
              },
              {
                TypeCode: 'IMCH',
                Type: 'Imprint Method Charge',
                Description: '3D Embroidery',
                Prices: [
                  {
                    Quantity: {
                      From: 1,
                      To: 2147483647,
                    },
                    Price: 2.5,
                    Cost: 1.5,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                ],
                PriceIncludes:
                  'per piece. Max size 4.5" W x 2.25" H on most cap styles. ',
                IsRequired: true,
              },
              {
                TypeCode: 'INCH',
                Type: 'Change of Ink/Thread',
                Description: 'Embroidery',
                Prices: [
                  {
                    Quantity: {
                      From: 1,
                      To: 2147483647,
                    },
                    Price: 10,
                    Cost: 6,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                ],
                PriceIncludes:
                  'per change of thread colors during production time.',
                IsRequired: false,
              },
            ],
          },
          {
            Code: '$0TW',
            Name: 'Screen Printed Plastisol Heat Transfer',
            Options: null,
            Charges: [
              {
                TypeCode: 'STCH',
                Type: 'Set-up Charge',
                Description: 'Screen Printed Plastisol Heat Transfer',
                Prices: [
                  {
                    Quantity: {
                      From: 0,
                      To: 2147483647,
                    },
                    CurrencyCode: 'USD',
                    IsQUR: true,
                  },
                ],
                PriceIncludes: 'Includes artwork and screen set up fees.',
                IsRequired: true,
              },
              {
                TypeCode: 'RNCH',
                Type: 'Run Charge',
                Description: 'Screen Printed Plastisol Heat Transfer',
                Prices: [
                  {
                    Quantity: {
                      From: 48,
                      To: 143,
                    },
                    Price: 5,
                    Cost: 3,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                  {
                    Quantity: {
                      From: 144,
                      To: 287,
                    },
                    Price: 3.333,
                    Cost: 2,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                  {
                    Quantity: {
                      From: 288,
                      To: 575,
                    },
                    Price: 2.5,
                    Cost: 1.5,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                  {
                    Quantity: {
                      From: 576,
                      To: 1295,
                    },
                    Price: 2.167,
                    Cost: 1.3,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                  {
                    Quantity: {
                      From: 1296,
                      To: 2147483647,
                    },
                    Price: 1.833,
                    Cost: 1.1,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                ],
                PriceIncludes: '1st Color',
                UsageLevelCode: 'PQTY',
                UsageLevel: 'Per Quantity',
                IsRequired: true,
              },
              {
                TypeCode: 'INCH',
                Type: 'Change of Ink/Thread',
                Description: 'Screen Printed Plastisol Heat Transfer',
                Prices: [
                  {
                    Quantity: {
                      From: 1,
                      To: 2147483647,
                    },
                    Price: 16.667,
                    Cost: 10,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                ],
                PriceIncludes: 'per color change during production time.',
                IsRequired: false,
              },
            ],
          },
          {
            Code: '$0TR',
            Name: 'Digital Print Heat Transfer',
            Options: null,
          },
          {
            Code: '$0TQ',
            Name: 'Full Color Print Vinyl Heat Transfer',
            Options: null,
          },
          {
            Code: '$0TU',
            Name: 'Foil Transfer Print',
            Options: null,
            Charges: [
              {
                TypeCode: 'RNCH',
                Type: 'Run Charge',
                Description: 'Foil Transfer Print',
                PriceIncludes: null,
                Prices: [
                  {
                    Quantity: {
                      From: 48,
                      To: 143,
                    },
                    Price: 6.167,
                    Cost: 3.7,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                  {
                    Quantity: {
                      From: 144,
                      To: 287,
                    },
                    Price: 4.667,
                    Cost: 2.8,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                  {
                    Quantity: {
                      From: 288,
                      To: 575,
                    },
                    Price: 3.833,
                    Cost: 2.3,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                  {
                    Quantity: {
                      From: 576,
                      To: 1295,
                    },
                    Price: 3.5,
                    Cost: 2.1,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                  {
                    Quantity: {
                      From: 1296,
                      To: 2147483647,
                    },
                    Price: 3.333,
                    Cost: 2,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                ],
                UsageLevelCode: 'PQTY',
                UsageLevel: 'Per Quantity',
                IsRequired: true,
              },
            ],
          },
          {
            Code: '$0TR',
            Name: 'Vinyl Applique Heat Transfer',
            Options: null,
          },
        ],
      },
      Services: {
        Values: [
          {
            Code: '$2HH',
            Name: 'Art Services',
            Options: null,
            Charges: [
              {
                TypeCode: 'ARCH',
                Type: 'Artwork Charge',
                Description: 'Art Services',
                Prices: [
                  {
                    Quantity: {
                      From: 1,
                      To: 2147483647,
                    },
                    Price: 66.667,
                    Cost: 40,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                ],
                PriceIncludes:
                  'per hour for edits or re-creation of artwork. Quoted on a per-job basis.',
                IsRequired: false,
              },
            ],
          },
          {
            Code: '$2HH',
            Name: 'Embroidery - Pre Production Sample',
            Options: null,
            Charges: [
              {
                TypeCode: 'SMCH',
                Type: 'Sample Charge',
                Description: 'Embroidery - Pre Production Sample',
                Prices: [
                  {
                    Quantity: {
                      From: 1,
                      To: 2147483647,
                    },
                    Price: 16.667,
                    Cost: 10,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                ],
                PriceIncludes: 'per sample',
                IsRequired: false,
              },
            ],
          },
          {
            Code: '$2HH',
            Name: 'Screen Printed Plastisol Heat Transfer - - Pre Production Sample',
            Options: null,
            Charges: [
              {
                TypeCode: 'SMCH',
                Type: 'Sample Charge',
                Description:
                  'Screen Printed Plastisol Heat Transfer - Pre Production Sample',
                Prices: [
                  {
                    Quantity: {
                      From: 1,
                      To: 2147483647,
                    },
                    Price: 25,
                    Cost: 15,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                ],
                PriceIncludes: 'per sample. Screen set up fees may apply.',
                IsRequired: false,
              },
            ],
          },
          {
            Code: '$2HH',
            Name: 'Digital Print Heat Transfer - Pre Production Sample',
            Options: null,
            Charges: [
              {
                TypeCode: 'SMCH',
                Type: 'Sample Charge',
                Description:
                  'Digital Print Heat Transfer - Pre Production Sample',
                Prices: [
                  {
                    Quantity: {
                      From: 1,
                      To: 2147483647,
                    },
                    Price: 25,
                    Cost: 15,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                ],
                PriceIncludes: 'per sample',
                IsRequired: false,
              },
            ],
          },
          {
            Code: '$2HH',
            Name: 'Full Color Print Vinyl Heat Transfer - Pre Production Sample',
            Options: null,
            Charges: [
              {
                TypeCode: 'SMCH',
                Type: 'Sample Charge',
                Description:
                  'Full Color Print Vinyl Heat Transfer - Pre Production Sample',
                Prices: [
                  {
                    Quantity: {
                      From: 1,
                      To: 2147483647,
                    },
                    Price: 25,
                    Cost: 15,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                ],
                PriceIncludes: 'per sample',
                IsRequired: false,
              },
            ],
          },
          {
            Code: '$2HH',
            Name: 'Foil Transfer Print - Pre Production Sample',
            Options: null,
            Charges: [
              {
                TypeCode: 'SMCH',
                Type: 'Sample Charge',
                Description: 'Foil Transfer Print - Pre Production Sample',
                Prices: [
                  {
                    Quantity: {
                      From: 1,
                      To: 2147483647,
                    },
                    Price: 25,
                    Cost: 15,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                ],
                PriceIncludes: 'per sample',
                IsRequired: false,
              },
            ],
          },
          {
            Code: '$2HH',
            Name: 'Vinyl Applique Heat Transfer - Pre Production Sample',
            Options: null,
            Charges: [
              {
                TypeCode: 'SMCH',
                Type: 'Sample Charge',
                Description:
                  'Vinyl Applique Heat Transfer - Pre Production Sample',
                PriceIncludes: null,
                Prices: [
                  {
                    Quantity: {
                      From: 1,
                      To: 2147483647,
                    },
                    Price: 25,
                    Cost: 15,
                    DiscountCode: 'R',
                    CurrencyCode: 'USD',
                    IsQUR: false,
                  },
                ],
                IsRequired: false,
              },
            ],
          },
        ],
      },
      Sizes: {
        Values: [
          {
            Code: '$2HQ',
            Name: '4.5" W x 2.25" H',
            Options: [
              {
                Type: 'Imprint Location',
                Values: ['Front of Cap'],
              },
            ],
          },
          {
            Code: '$2HQ',
            Name: '3.5" W x 1.25" H',
            Options: [
              {
                Type: 'Imprint Location',
                Values: ['Back of Cap'],
              },
            ],
          },
          {
            Code: '$2HQ',
            Name: '2.5" W x 1.5" H',
            Options: [
              {
                Type: 'Imprint Location',
                Values: ['Side of Cap'],
              },
            ],
          },
        ],
      },
      Locations: {
        Values: ['Front of Cap', 'Back of Cap', 'Side of Cap'],
      },
      Options: [
        {
          Name: 'Additional Colors',
          Charges: [
            {
              TypeCode: 'COCH',
              Type: 'Add. Color Charge',
              Description:
                'Screen Printed Plastisol Heat Transfer Additional Colors - Up to 8 Colors',
              Prices: [
                {
                  Quantity: {
                    From: 48,
                    To: 143,
                    $index: 1,
                  },
                  Price: 0.833,
                  Cost: 0.5,
                  DiscountCode: 'R',
                  CurrencyCode: 'USD',
                  IsQUR: false,
                },
                {
                  Quantity: {
                    From: 144,
                    To: 287,
                    $index: 1,
                  },
                  Price: 0.417,
                  Cost: 0.25,
                  DiscountCode: 'R',
                  CurrencyCode: 'USD',
                  IsQUR: false,
                },
                {
                  Quantity: {
                    From: 288,
                    To: 575,
                    $index: 1,
                  },
                  Price: 0.25,
                  Cost: 0.15,
                  DiscountCode: 'R',
                  CurrencyCode: 'USD',
                  IsQUR: false,
                },
                {
                  Quantity: {
                    From: 576,
                    To: 1295,
                    $index: 1,
                  },
                  Price: 0.167,
                  Cost: 0.1,
                  DiscountCode: 'R',
                  CurrencyCode: 'USD',
                  IsQUR: false,
                },
                {
                  Quantity: {
                    From: 1296,
                    To: 2147483647,
                    $index: 1,
                  },
                  Price: 0.167,
                  Cost: 0.1,
                  DiscountCode: 'R',
                  CurrencyCode: 'USD',
                  IsQUR: false,
                },
              ],
              PriceIncludes: 'Up to 8 Colors.',
              UsageLevelCode: 'PQTY',
              UsageLevel: 'Per Quantity',
              IsRequired: false,
            },
          ],
          Values: [
            'Screen Printed Plastisol Heat Transfer Additional Colors - Up to 8 Colors',
          ],
        },
        {
          Name: 'Imprint Options for Embroidery',
          Groups: [
            {
              Name: 'Applying Sticker / Tagging',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Applying Sticker / Tagging',
                  Prices: [
                    {
                      Quantity: {
                        From: 1,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 0.333,
                      Cost: 0.2,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  PriceIncludes:
                    'per service and item. does not include stickers or tags. Stickers and tags provided by customer.',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Edit Charge',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Edit Charge',
                  Prices: [
                    {
                      Quantity: {
                        From: 1,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 58.333,
                      Cost: 35,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  PriceIncludes: 'per logo. Maximum up to 10,000 stitches.',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Metallic; Neon; Name Brand Thread / Colors',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Metallic; Neon; Name Brand Thread / Colors',
                  Prices: [
                    {
                      Quantity: {
                        From: 0,
                        To: 2147483647,
                        $index: 1,
                      },
                      CurrencyCode: 'USD',
                      IsQUR: true,
                    },
                  ],
                  PriceIncludes: 'Quoted on a per-job basis.',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Oversize Charge',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Oversize Charge',
                  Prices: [
                    {
                      Quantity: {
                        From: 0,
                        To: 2147483647,
                        $index: 1,
                      },
                      CurrencyCode: 'USD',
                      IsQUR: true,
                    },
                  ],
                  PriceIncludes:
                    'Quoted on a per-job basis. Max size 4.5" W x 2.25" H on most cap styles.',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Sewing Patches',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Sewing Patches',
                  Prices: [
                    {
                      Quantity: {
                        From: 0,
                        To: 2147483647,
                        $index: 1,
                      },
                      CurrencyCode: 'USD',
                      IsQUR: true,
                    },
                  ],
                  PriceIncludes:
                    'Quoted on a per-job basis. Max size 4.5" W x 2.25" H on most cap styles.',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Sewing Private Label',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Sewing Private Label',
                  Prices: [
                    {
                      Quantity: {
                        From: 0,
                        To: 2147483647,
                        $index: 1,
                      },
                      CurrencyCode: 'USD',
                      IsQUR: true,
                    },
                  ],
                  PriceIncludes:
                    'Quoted on a per-job basis. Label provided by customer.',
                  IsRequired: false,
                },
              ],
            },
          ],
        },
        {
          Name: 'Imprint options Colors for Foil Transfer',
          Type: 'Imprint Option',
          Values: ['Gold', 'Rose Gold', 'Silver'],
        },
        {
          Name: 'Full Color Print Vinyl Heat Transfer',
          Groups: [
            {
              Name: '5 Panel Cap or Flat Panel',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: '5 Panel Cap or Flat Panel',
                  Prices: [
                    {
                      Quantity: {
                        From: 48,
                        To: 143,
                        $index: 1,
                      },
                      Price: 6.833,
                      Cost: 4.1,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 144,
                        To: 287,
                        $index: 1,
                      },
                      Price: 5.5,
                      Cost: 3.3,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 288,
                        To: 575,
                        $index: 1,
                      },
                      Price: 5,
                      Cost: 3,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 576,
                        To: 1295,
                        $index: 1,
                      },
                      Price: 4.667,
                      Cost: 2.8,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 1296,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 4.333,
                      Cost: 2.6,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  UsageLevelCode: 'PQTY',
                  UsageLevel: 'Per Quantity',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: '6 Panel Cap or Panel with Seam',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: '6 Panel Cap or Panel with Seam',
                  Prices: [
                    {
                      Quantity: {
                        From: 48,
                        To: 143,
                        $index: 1,
                      },
                      Price: 7.333,
                      Cost: 4.4,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 144,
                        To: 287,
                        $index: 1,
                      },
                      Price: 6,
                      Cost: 3.6,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 288,
                        To: 575,
                        $index: 1,
                      },
                      Price: 5.5,
                      Cost: 3.3,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 576,
                        To: 1295,
                        $index: 1,
                      },
                      Price: 5.167,
                      Cost: 3.1,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 1296,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 4.833,
                      Cost: 2.9,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  UsageLevelCode: 'PQTY',
                  UsageLevel: 'Per Quantity',
                  IsRequired: false,
                },
              ],
            },
          ],
        },
        {
          Name: 'Imprint Options for Embroidery Stitch Count',
          Groups: [
            {
              Name: '5001-6000',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: '5001-6000',
                  Prices: [
                    {
                      Quantity: {
                        From: 48,
                        To: 143,
                        $index: 1,
                      },
                      Price: 5,
                      Cost: 3,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 144,
                        To: 287,
                        $index: 1,
                      },
                      Price: 4.167,
                      Cost: 2.5,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 288,
                        To: 575,
                        $index: 1,
                      },
                      Price: 3.417,
                      Cost: 2.05,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 576,
                        To: 1295,
                        $index: 1,
                      },
                      Price: 3.25,
                      Cost: 1.95,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 1296,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 2.917,
                      Cost: 1.75,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  UsageLevelCode: 'PQTY',
                  UsageLevel: 'Per Quantity',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: '6001-7000',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: '6001-7000',
                  Prices: [
                    {
                      Quantity: {
                        From: 48,
                        To: 143,
                        $index: 1,
                      },
                      Price: 5.417,
                      Cost: 3.25,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 144,
                        To: 287,
                        $index: 1,
                      },
                      Price: 4.583,
                      Cost: 2.75,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 288,
                        To: 575,
                        $index: 1,
                      },
                      Price: 3.833,
                      Cost: 2.3,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 576,
                        To: 1295,
                        $index: 1,
                      },
                      Price: 3.667,
                      Cost: 2.2,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 1296,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 3.333,
                      Cost: 2,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  UsageLevelCode: 'PQTY',
                  UsageLevel: 'Per Quantity',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: '7001-8000',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: '7001-8000',
                  Prices: [
                    {
                      Quantity: {
                        From: 48,
                        To: 143,
                        $index: 1,
                      },
                      Price: 5.833,
                      Cost: 3.5,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 144,
                        To: 287,
                        $index: 1,
                      },
                      Price: 5,
                      Cost: 3,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 288,
                        To: 575,
                        $index: 1,
                      },
                      Price: 4.25,
                      Cost: 2.55,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 576,
                        To: 1295,
                        $index: 1,
                      },
                      Price: 4.083,
                      Cost: 2.45,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 1296,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 3.75,
                      Cost: 2.25,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  UsageLevelCode: 'PQTY',
                  UsageLevel: 'Per Quantity',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: '8001-9000',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: '8001-9000',
                  Prices: [
                    {
                      Quantity: {
                        From: 48,
                        To: 143,
                        $index: 1,
                      },
                      Price: 6.25,
                      Cost: 3.75,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 144,
                        To: 287,
                        $index: 1,
                      },
                      Price: 5.417,
                      Cost: 3.25,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 288,
                        To: 575,
                        $index: 1,
                      },
                      Price: 4.667,
                      Cost: 2.8,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 576,
                        To: 1295,
                        $index: 1,
                      },
                      Price: 4.5,
                      Cost: 2.7,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 1296,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 4.167,
                      Cost: 2.5,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  UsageLevelCode: 'PQTY',
                  UsageLevel: 'Per Quantity',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: '9001-10000',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: '9001-10000',
                  Prices: [
                    {
                      Quantity: {
                        From: 48,
                        To: 143,
                        $index: 1,
                      },
                      Price: 6.667,
                      Cost: 4,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 144,
                        To: 287,
                        $index: 1,
                      },
                      Price: 5.833,
                      Cost: 3.5,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 288,
                        To: 575,
                        $index: 1,
                      },
                      Price: 5.083,
                      Cost: 3.05,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 576,
                        To: 1295,
                        $index: 1,
                      },
                      Price: 4.917,
                      Cost: 2.95,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 1296,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 4.583,
                      Cost: 2.75,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  UsageLevelCode: 'PQTY',
                  UsageLevel: 'Per Quantity',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Per each additional 1K stitches',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Per each additional 1K stitches',
                  Prices: [
                    {
                      Quantity: {
                        From: 1,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 0.417,
                      Cost: 0.25,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Under 5000',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Under 5000',
                  Prices: [
                    {
                      Quantity: {
                        From: 48,
                        To: 143,
                        $index: 1,
                      },
                      Price: 4.583,
                      Cost: 2.75,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 144,
                        To: 287,
                        $index: 1,
                      },
                      Price: 3.75,
                      Cost: 2.25,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 288,
                        To: 575,
                        $index: 1,
                      },
                      Price: 3,
                      Cost: 1.8,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 576,
                        To: 1295,
                        $index: 1,
                      },
                      Price: 2.833,
                      Cost: 1.7,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 1296,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 2.5,
                      Cost: 1.5,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  UsageLevelCode: 'PQTY',
                  UsageLevel: 'Per Quantity',
                  IsRequired: false,
                },
              ],
            },
          ],
        },
        {
          Name: 'Imprint Options for Silkscreen',
          Groups: [
            {
              Name: 'Applying Sticker / Tagging',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Applying Sticker / Tagging',
                  Prices: [
                    {
                      Quantity: {
                        From: 1,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 0.333,
                      Cost: 0.2,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  PriceIncludes:
                    'per service and item. does not include stickers or tags. Stickers and tags provided by customer.',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Emblem Patch Heat Seal',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Emblem Patch Heat Seal',
                  Prices: [
                    {
                      Quantity: {
                        From: 1,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 1.5,
                      Cost: 0.9,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  PriceIncludes:
                    'per emblem, does not include emblems. Emblem patches provided by customer. Max size 4" W x 2.25" H',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Oversize Charge',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Oversize Charge',
                  Prices: [
                    {
                      Quantity: {
                        From: 0,
                        To: 2147483647,
                        $index: 1,
                      },
                      CurrencyCode: 'USD',
                      IsQUR: true,
                    },
                  ],
                  PriceIncludes:
                    'Quoted on a per-job basis. Max size 5" W x 2.75" H on most cap styles.',
                  IsRequired: false,
                },
              ],
            },
          ],
        },
        {
          Name: 'Digital Print Heat Transfer Print Type',
          Groups: [
            {
              Name: 'Gloss Print',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Gloss Print',
                  Prices: [
                    {
                      Quantity: {
                        From: 48,
                        To: 143,
                        $index: 1,
                      },
                      Price: 4.833,
                      Cost: 2.9,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 144,
                        To: 287,
                        $index: 1,
                      },
                      Price: 3.333,
                      Cost: 2,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 288,
                        To: 575,
                        $index: 1,
                      },
                      Price: 2.5,
                      Cost: 1.5,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 576,
                        To: 1295,
                        $index: 1,
                      },
                      Price: 2.167,
                      Cost: 1.3,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 1296,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 2,
                      Cost: 1.2,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  UsageLevelCode: 'PQTY',
                  UsageLevel: 'Per Quantity',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Matte Print',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Matte Print',
                  Prices: [
                    {
                      Quantity: {
                        From: 48,
                        To: 143,
                        $index: 1,
                      },
                      Price: 5.667,
                      Cost: 3.4,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 144,
                        To: 287,
                        $index: 1,
                      },
                      Price: 4.167,
                      Cost: 2.5,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 288,
                        To: 575,
                        $index: 1,
                      },
                      Price: 3.333,
                      Cost: 2,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 576,
                        To: 1295,
                        $index: 1,
                      },
                      Price: 3,
                      Cost: 1.8,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 1296,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 2.833,
                      Cost: 1.7,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  UsageLevelCode: 'PQTY',
                  UsageLevel: 'Per Quantity',
                  IsRequired: false,
                },
              ],
            },
          ],
        },
        {
          Name: 'Imprint Options for Digital Print Heat Transfer',
          Groups: [
            {
              Name: 'Applying Sticker / Tagging',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Applying Sticker / Tagging',
                  Prices: [
                    {
                      Quantity: {
                        From: 1,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 0.333,
                      Cost: 0.2,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  PriceIncludes:
                    'per service and item. does not include stickers or tags. Stickers and tags provided by customer.',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Oversize Charge',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Oversize Charge',
                  Prices: [
                    {
                      Quantity: {
                        From: 0,
                        To: 2147483647,
                        $index: 1,
                      },
                      CurrencyCode: 'USD',
                      IsQUR: true,
                    },
                  ],
                  PriceIncludes:
                    'Quoted on a per-job basis. Max size 5" W x 2.75" H on most cap styles.',
                  IsRequired: false,
                },
              ],
            },
          ],
        },
        {
          Name: 'Imprint Options for Full Color Print Vinyl Heat Transfer',
          Groups: [
            {
              Name: 'Applying Sticker / Tagging',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Applying Sticker / Tagging',
                  Prices: [
                    {
                      Quantity: {
                        From: 1,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 0.333,
                      Cost: 0.2,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  PriceIncludes:
                    'per service and item. does not include stickers or tags. Stickers and tags provided by customer.',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Oversize Charge',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Oversize Charge',
                  Prices: [
                    {
                      Quantity: {
                        From: 0,
                        To: 2147483647,
                        $index: 1,
                      },
                      CurrencyCode: 'USD',
                      IsQUR: true,
                    },
                  ],
                  PriceIncludes:
                    'Quoted on a per-job basis. Max size 5" W x 2.75" H on most cap styles.',
                  IsRequired: false,
                },
              ],
            },
          ],
        },
        {
          Name: 'Imprint Options for Foil Transfer Print',
          Groups: [
            {
              Name: 'Applying Sticker / Tagging',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Applying Sticker / Tagging',
                  Prices: [
                    {
                      Quantity: {
                        From: 1,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 0.333,
                      Cost: 0.2,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  PriceIncludes:
                    'per service and item. does not include stickers or tags. Stickers and tags provided by customer.',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Oversize Charge',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Oversize Charge',
                  Prices: [
                    {
                      Quantity: {
                        From: 0,
                        To: 2147483647,
                        $index: 1,
                      },
                      CurrencyCode: 'USD',
                      IsQUR: true,
                    },
                  ],
                  PriceIncludes:
                    'Quoted on a per-job basis. Max size 4.5" W x 2.25" H on most cap styles.',
                  IsRequired: false,
                },
              ],
            },
          ],
        },
        {
          Name: 'Vinyl Applique Heat Transfer Film Type',
          Groups: [
            {
              Name: 'Fashion-FILM\ufffd',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Fashion-FILM\ufffd',
                  Prices: [
                    {
                      Quantity: {
                        From: 48,
                        To: 143,
                        $index: 1,
                      },
                      Price: 7.167,
                      Cost: 4.3,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 144,
                        To: 287,
                        $index: 1,
                      },
                      Price: 5.833,
                      Cost: 3.5,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 288,
                        To: 575,
                        $index: 1,
                      },
                      Price: 5.167,
                      Cost: 3.1,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 576,
                        To: 1295,
                        $index: 1,
                      },
                      Price: 4.833,
                      Cost: 2.9,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 1296,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 4.5,
                      Cost: 2.7,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  UsageLevelCode: 'PQTY',
                  UsageLevel: 'Per Quantity',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Glitter & Glitter Flake\ufffd',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Glitter & Glitter Flake\ufffd',
                  Prices: [
                    {
                      Quantity: {
                        From: 48,
                        To: 143,
                        $index: 1,
                      },
                      Price: 8.333,
                      Cost: 5,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 144,
                        To: 287,
                        $index: 1,
                      },
                      Price: 7,
                      Cost: 4.2,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 288,
                        To: 575,
                        $index: 1,
                      },
                      Price: 6.333,
                      Cost: 3.8,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 576,
                        To: 1295,
                        $index: 1,
                      },
                      Price: 6,
                      Cost: 3.6,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                    {
                      Quantity: {
                        From: 1296,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 5.667,
                      Cost: 3.4,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  UsageLevelCode: 'PQTY',
                  UsageLevel: 'Per Quantity',
                  IsRequired: false,
                },
              ],
            },
          ],
        },
        {
          Name: 'Imprint Options for Vinyl Applique Heat Transfer',
          Groups: [
            {
              Name: 'Applying Sticker / Tagging',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Applying Sticker / Tagging',
                  Prices: [
                    {
                      Quantity: {
                        From: 1,
                        To: 2147483647,
                        $index: 1,
                      },
                      Price: 0.333,
                      Cost: 0.2,
                      DiscountCode: 'R',
                      CurrencyCode: 'USD',
                      IsQUR: false,
                    },
                  ],
                  PriceIncludes:
                    'per service and item. does not include stickers or tags. Stickers and tags provided by customer.',
                  IsRequired: false,
                },
              ],
            },
            {
              Name: 'Oversize Charge',
              Charges: [
                {
                  TypeCode: 'IOCH',
                  Type: 'Imprint Option Charge',
                  Description: 'Oversize Charge',
                  Prices: [
                    {
                      Quantity: {
                        From: 0,
                        To: 2147483647,
                        $index: 1,
                      },
                      CurrencyCode: 'USD',
                      IsQUR: true,
                    },
                  ],
                  PriceIncludes:
                    'Quoted on a per-job basis. Max size 5" W x 2.75" H on most cap styles.',
                  IsRequired: false,
                },
              ],
            },
          ],
        },
      ],
      FullColorProcess: true,
      Personalization: true,
      SoldUnimprinted: true,
      AdditionalInfo:
        'Screen Printed Plastisol Heat Transfer Additional PMS Matching: Due to variances in substrates, exact matches cannot be guaranteed.',
    },
    Samples: {},
    Prop65AdditionalInfo: faker.lorem.words(),
    HasFullColorProcess: true,
    HasProp65Warning: true,
    HasRushService: true,
    HighestPrice: {
      Quantity: faker.datatype.number(),
      Price: faker.datatype.number(),
      Cost: faker.datatype.number(),
      DiscountCode: null,
      CurrencyCode: faker.finance.currencyCode(),
      IsQUR: false,
    },
    Currencies: [],
    Currency: faker.finance.currencyCode(),
    DistributorComments: faker.lorem.words(),
    LowestPrice: {
      Quantity: faker.datatype.number(),
      Price: faker.datatype.number(),
      Cost: faker.datatype.number(),
      DiscountCode: null,
      CurrencyCode: faker.finance.currencyCode(),
      IsQUR: false,
    },
    UpdateDate: faker.date.past().toISOString(),
    Variants: [
      {
        Attributes: [],
        Description: 'Description of variant',
        ImageUrl: 'https://imageurl.com',
        PriceIncludes: 'Taxes and Shipping fees',
        Prices: [
          {
            Quantity: {
              From: 48,
              To: 143,
            },
            Price: 6.8,
            Cost: 3.4,
            DiscountCode: 'P',
            CurrencyCode: 'USD',
            IsQUR: false,
          },
        ],
        Values: [
          {
            Code: 'UPSC4343',
            Description: 'Value description',
            Values: [
              {
                Name: 'ValueName',
                Seq: 0,
              },
            ],
          },
        ],
      },
    ],
  };
};
const mockCheckedProduct = (Id): Partial<Product> => {
  return { Id: Id };
};

const generateRecords = (
  generator: any,
  size = faker.datatype.number({ min: 50, max: 200 })
) => {
  const res = [];

  for (let i = 0; i < size; i++) {
    res.push(generator(i));
  }

  return res;
};

const generateMap = (
  generator: any,
  size = faker.datatype.number({ min: 50, max: 200 })
) => {
  const res = new Map();

  for (let i = 0; i < size; i++) {
    res.set(i, generator(i));
  }

  return res;
};

export class ProductsMockDb {
  public static get products() {
    return generateRecords(mockProduct);
  }
  public static checkedProducts(size: number) {
    return generateMap(mockCheckedProduct, size);
  }
}
