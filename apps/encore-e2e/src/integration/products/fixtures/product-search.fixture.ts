import { Environment, Fixtures } from '@cosmos/cypress';

interface ProductSearchPageData {
  productList: Array<any>;
  newOwner: string;
  ExcludePills: Array<string>;
  Material: Array<string>;
  cpnNum: number;
  companyId: number;
  prodNum: number;
}

const testFixtures: Fixtures<ProductSearchPageData> = {
  dev: {
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    email: Cypress.env('email'),
    data: {
      newOwner: 'Adnan Unit Test',
      productList: [
        {
          Id: 6842104,
          ObjectId: '6842104-840278167-6',
          Name: 'Stylus Grip Ballpoint iPen',
          Description:
            'This stylus ballpoint iPen is a handy and versatile instrument perfect for students and professionals alike. Available in several colors, this 2-in-1 handout is a ballpoint pen on one end and a stylus for smartphones and tablets on the other. It can be customized with your company name and logo, brand message and more for heightened brand visibility on an often-used product.',
          ShortDescription: 'Stylus ballpoint iPen; 5.25" W x 0.625" H.',
          Number: 'ABP767',
          ImageUrl: 'media/34506074',
          Supplier: {
            Id: 8532,
            Name: 'Bel Promo',
            AsiNumber: '39552',
            Rating: { Rating: 10, Transactions: 354, Reports: 354 },
          },
          Price: {
            Id: 840278167,
            Quantity: 5000,
            Price: 0.86,
            Cost: 0.516,
            DiscountCode: 'R',
            CurrencyCode: 'USD',
          },
          IsNew: false,
          IsConfirmed: false,
          HasInventory: false,
          ColorCount: 4,
          Ad: { Id: 20025272, Position: 2, Row: 0 },
        },
        {
          Id: 553442449,
          ObjectId: '553442449-848146676-5',
          Name: '16 Oz. Frost Flex Stadium Cup',
          Description:
            'Made In The USA. Meets FDA Requirements. BPA Free. Hand Wash Recommended.',
          ShortDescription:
            '16 Oz. Frost Flex Stadium Cup. Made In The USA.  Meets FDA Requirements.  BPA Free.  Hand Wash Recommended.',
          Number: '5921',
          ImageUrl: 'media/92284255',
          Supplier: {
            Id: 1780,
            Name: 'Hit Promotional Products',
            AsiNumber: '61125',
            Rating: { Rating: 9, Transactions: 1054, Reports: 1054 },
          },
          Price: {
            Id: 848146676,
            Quantity: 5000,
            Price: 0.85,
            Cost: 0.51,
            DiscountCode: 'R',
            CurrencyCode: 'USD',
          },
          IsNew: true,
          IsConfirmed: true,
          HasInventory: false,
          ColorCount: 1,
        },
        {
          Id: 553442448,
          ObjectId: '553442448-848146673-5',
          Name: '10 Oz. Frost Flex Cup',
          Description:
            'Made In The USA. Meets FDA Requirements. BPA Free. Hand Wash Recommended.',
          ShortDescription:
            '10 Oz. Frost Flex Cup. Made In The USA.  Meets FDA Requirements.  BPA Free.  Hand Wash Recommended.',
          Number: '5910',
          ImageUrl: 'media/92284252',
          Supplier: {
            Id: 1780,
            Name: 'Hit Promotional Products',
            AsiNumber: '61125',
            Rating: { Rating: 9, Transactions: 1054, Reports: 1054 },
          },
          Price: {
            Id: 848146673,
            Quantity: 5000,
            Price: 0.65,
            Cost: 0.39,
            DiscountCode: 'R',
            CurrencyCode: 'USD',
          },
          IsNew: true,
          IsConfirmed: true,
          HasInventory: false,
          ColorCount: 1,
        },
        {
          Id: 6840450,
          ObjectId: '6840450-33115205-1',
          Name: 'Microfiber Sports Cap with Trim on Edge of Crown & Peak',
          Description:
            'Microfiber sports cap with trim on edge of crown and peak. Features unstructured 6 panel sports profile, pre-curved peak and fabric covered short touch strap.',
          ShortDescription:
            'Microfiber Sports Cap with trim on edge of crown and peak.',
          Number: '4094',
          ImageUrl: 'media/23339056',
          Supplier: {
            Id: 432013,
            Name: 'Headwear Canada',
            AsiNumber: '60281',
          },
          Price: {
            Id: 33115205,
            Quantity: 1,
            Price: 7.1,
            Cost: 3.55,
            DiscountCode: 'P',
            CurrencyCode: 'CAD',
          },
          IsNew: false,
          IsConfirmed: false,
          HasInventory: false,
          ColorCount: 5,
        },
        {
          Id: 1679603,
          ObjectId: '1679603-798348501-1',
          Name: 'Custom die cut signs',
          Description:
            'Custom cut "On Board" signs.  Please contact us with your idea, if we don\'t already have an existing die, we\'ll get it made for you. The possibilities here are endless. We will create the perfect custom die cut piece for your needs.',
          ShortDescription: 'Custom die cut "On Board" signs.',
          Number: '1000-S',
          ImageUrl: 'media/0',
          Supplier: {
            Id: 3168,
            Name: 'Screen Printing Plus Corp',
            AsiNumber: '85945',
          },
          Price: { Id: 798348501, Quantity: 1, CurrencyCode: 'USD' },
          IsNew: false,
          IsConfirmed: false,
          HasInventory: false,
          ColorCount: 0,
        },
        {
          Id: 1679602,
          ObjectId: '1679602-798348502-1',
          Name: 'Custom die cut rear-view mirror tags',
          Description:
            "Custom cut rear-view mirror tags.  Please contact us with your idea, if we don't already have an existing die, we'll get it made for you. The possibilities here are endless. We will create the perfect custom die cut piece for your needs.",
          ShortDescription: 'Custom die cut rear-view mirror tags.',
          Number: '1000-T',
          ImageUrl: 'media/0',
          Supplier: {
            Id: 3168,
            Name: 'Screen Printing Plus Corp',
            AsiNumber: '85945',
          },
          Price: { Id: 798348502, Quantity: 1, CurrencyCode: 'USD' },
          IsNew: false,
          IsConfirmed: false,
          HasInventory: false,
          ColorCount: 0,
        },
        {
          Id: 6073100,
          ObjectId: '6073100-33048807-5',
          Name: 'Eco Cotton Tote (Custom Overseas Only)',
          Description:
            'This item is for custom overseas only. Please contact us for quote and minimum. Make an impact with this eco cotton tote! It\'s made of 8 oz., 100% cotton, measures 18" x 13.5" x 3.5", and is available in several fantastic colors. This has a 24" handle, making it as comfortable as possible to carry around. Give this out at the next trade show so clients can throw in all of their new promo freebies while advertising your brand. Use one of our imprint methods to add your company name or logo and get your brand seen!',
          ShortDescription:
            'Tote bag measuring 18" x 13.5" x 3.5" and made of 8 oz., 100% cotton with a 24" handle.',
          Number: 'ST1217',
          ImageUrl: 'media/6878323',
          Supplier: {
            Id: 4827,
            Name: 'Bagworld',
            AsiNumber: '37980',
            Rating: { Rating: 10, Transactions: 75, Reports: 75 },
          },
          Price: {
            Id: 33048807,
            Quantity: 2500,
            Price: 4.4,
            Cost: 2.64,
            DiscountCode: 'R',
            CurrencyCode: 'USD',
          },
          IsNew: false,
          IsConfirmed: false,
          HasInventory: false,
          ColorCount: 3,
        },
        {
          Id: 4956281,
          ObjectId: '4956281-33048795-4',
          Name: 'Deluxe Zipper Pouch 6 Can Cooler  (Custom Overseas Only)',
          Description:
            'Show off this deluxe cooler and get a great response from customers! It\'s made of 70 denier polyester with heavy-duty insulation, heat-sealed, leak-proof lining, and holds up to six cans at once. This also features a large front zipper pocket and a 20.5" carrying handle. This is great to take on a picnic or barbecue or to use as a lunch bag for school or work. Add your company name or logo to get more eyes on your business!',
          ShortDescription:
            'Heavy-duty insulated six-can cooler made of 70 denier polyester with heat-sealed, leak-proof lining.',
          Number: 'CB805',
          ImageUrl: 'media/6878153',
          Supplier: {
            Id: 4827,
            Name: 'Bagworld',
            AsiNumber: '37980',
            Rating: { Rating: 10, Transactions: 75, Reports: 75 },
          },
          Price: {
            Id: 33048795,
            Quantity: 1000,
            Price: 4.488,
            Cost: 2.693,
            DiscountCode: 'R',
            CurrencyCode: 'USD',
          },
          IsNew: false,
          IsConfirmed: false,
          HasInventory: false,
          ColorCount: 1,
        },
        {
          Id: 6839403,
          ObjectId: '6839403-33099836-2',
          Name: 'Impressione Custom Etched Ballpoint Pen',
          Description:
            'Free Personalization. Custom etched ballpoint writing instrument will definitely set your company apart from the competition.',
          ShortDescription: 'Custom etched ballpoint pen.',
          Number: '6101CUS',
          ImageUrl: 'media/5623847',
          Supplier: {
            Id: 337,
            Name: "IMARK/American Nat'l Supply Inc",
            AsiNumber: '35579',
            Rating: { Rating: 10, Transactions: 11, Reports: 11 },
          },
          Price: { Id: 33099836, Quantity: 500, CurrencyCode: 'USD' },
          IsNew: false,
          IsConfirmed: false,
          HasInventory: false,
          ColorCount: 1,
        },
      ],
      ExcludePills: ['blue', 'mugs'],
      Material: ['Metal'],
      cpnNum: 0,
      companyId: 601497,
      prodNum: 0,
    },
  },
  uat: {
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    email: Cypress.env('email'),
    data: {
      newOwner: 'AAdnan Unit Test',
      productList: [],
      ExcludePills: [],
      Material: [],
      cpnNum: 0,
      companyId: 0,
      prodNum: 0,
    },
  },
  production: {
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    email: Cypress.env('email'),
    data: {
      newOwner: 'Adnan Unit Test',
      productList: [],
      ExcludePills: [],
      Material: [],
      cpnNum: 0,
      companyId: 0,
      prodNum: 0,
    },
  },
};

export const productSearch = (env: Environment) => testFixtures[env];
