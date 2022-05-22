import * as faker from 'faker/locale/en_US';
import { Collection } from '../src';

const product = {
  Id: 552185907,
  Name: 'Screwdriver Pen With Light',
  Description:
    'Get creative and handy with this screwdriver pen! A useful tool, this pen includes 2 Phillips, 2 flat heads, 1 star bit all stored inside the barrel. The twist-on LED flashlight is an added function that makes this multi-functional pen a one-of-a-kine. Item comes in two colors: Blue and Red. Pen comes in black ink.',
  ShortDescription:
    'Try out this multi-purpose tool pen! Equipped with screwdriver heads and a flashlight.',
  Number: 'TOL7',
  ImageUrl: 'media/34457871',
  Supplier: {
    Id: 2323,
    Name: 'WOWLine',
    AsiNumber: '98360',
    Rating: {
      Rating: 10,
      Transactions: 10,
    },
  },
  Price: {
    Quantity: 150,
    Price: 3.17,
    Cost: 1.902,
    DiscountCode: 'R',
    CurrencyCode: 'USD',
  },
  IsNew: false,
  IsConfirmed: false,
  HasInventory: true,
  HasVirtualSample: true,
  IsDeleted: false,
};

const mockCollection = (): Collection => {
  const ownerId = faker.datatype.number();
  return {
    Access: [{ AccessType: 'ReadWrite' }],
    AccessLevel: 'Owner',
    CreateDate: faker.date.past(2).toString(),
    CreatedBy: faker.random.words(),
    Description: faker.random.words(),
    Emoji: ':package:',
    Id: faker.datatype.number(),
    IsEditable: true,
    IsVisible: true,
    Name: faker.random.words(),
    OwnerId: ownerId,
    Products: Array(50)
      .fill(product)
      .map((prod) => ({ ...prod, Id: Math.random() })),
    Collaborators: [
      {
        ImageUrl: faker.image.avatar(),
        Name: faker.name.findName(),
        Role: 'Owner',
        UserId: ownerId,
      },
      {
        ImageUrl: faker.image.avatar(),
        Name: faker.name.findName(),
        Role: 'User',
        UserId: 0,
      },
      {
        ImageUrl: faker.image.avatar(),
        Name: faker.name.findName(),
        Role: 'User',
        UserId: 0,
      },
      {
        ImageUrl: faker.image.avatar(),
        Name: faker.name.findName(),
        Role: 'User',
        UserId: 0,
      },
      {
        ImageUrl: faker.image.avatar(),
        Name: faker.name.findName(),
        Role: 'User',
        UserId: 0,
      },
    ],
    Status: 'Active',
    TenantId: faker.datatype.number(),
    UpdateDate: faker.date.past(1).toString(),
    UpdatedBy: faker.random.words(),
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

export class CollectionMockDb {
  public static get Collections() {
    return generateRecords(mockCollection);
  }
}
