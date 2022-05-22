import * as faker from 'faker/locale/en_US';

import { ProductSearchResultItem } from '@smartlink/models';

const mockProduct = (): ProductSearchResultItem => {
  return {
    Id: 0,
    Name: '',
    Description: '',
    Number: '',
    ImageUrl: '',
    VirtualSampleImages: [
      {
        Id: 0,
        ImageUrl: '',
      },
    ],
    Supplier: {
      Id: 0,
      AsiNumber: '',
      Name: '',
      Address: {
        City: faker.address.city(),
        State: faker.address.state(),
        Zip: faker.address.zipCode(),
        Country: faker.address.countryCode(),
      },
      Phone: {
        Primary: faker.phone.phoneNumber(),
      },
      Fax: faker.phone.phoneNumber(),
      Email: faker.internet.email(),
      Websites: [],
      Products: faker.datatype.number(),
    },
    Price: {
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
    IsNew: false,
    IsConfirmed: false,
    HasVirtualSample: false,
    CatalogPage: null,
    ConfigId: '',
    ShortDescription: '',
    HasInventory: false,
  };
};

const generateRecords = (
  generator: any,
  size = faker.datatype.number({ min: 50, max: 200 })
) => {
  const res = [];

  for (let i = 0; i < size; i++) {
    res.push(generator());
  }

  return res;
};

export class ProductSearchResultsMockDb {
  public static get products() {
    return generateRecords(mockProduct);
  }
}
