import { SearchResult } from '@esp/models';
import { Product } from '@smartlink/models';
import * as faker from 'faker/locale/en_US';
import { Collection, CollectionSearch } from '../src';

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

const mockCollectionSearch = (): CollectionSearch => {
  return {
    TenantId: faker.datatype.number(),
    OwnerId: faker.datatype.number(),
    AccessLevel: 'Everyone',
    Access: null,
    IsVisible: faker.datatype.boolean(),
    IsEditable: faker.datatype.boolean(),
    Id: faker.datatype.number(),
    Name: faker.random.words(),
    Description: faker.random.words(),
    Products: [
      { url: 'media/33807255', alt: 'Image 1' },
      { url: 'media/33807255', alt: 'Image 2' },
      { url: 'media/33807255', alt: 'Image 3' },
      { url: 'media/33807255', alt: 'Image 4' },
      { url: 'media/33807255', alt: 'Image 5' },
      { url: 'media/33807255', alt: 'Image 6' },
      { url: 'media/33807255', alt: 'Image 7' },
      { url: 'media/33807255', alt: 'Image 8' },
      { url: 'media/33807255', alt: 'Image 9' },
    ],
    Collaborators: [
      {
        ImageUrl: faker.image.avatar(),
        Name: faker.name.findName(),
        Role: 'User',
        UserId: faker.datatype.number(),
      },
      {
        ImageUrl: faker.image.avatar(),
        Name: faker.name.findName(),
        Role: 'User',
        UserId: faker.datatype.number(),
      },
      {
        ImageUrl: faker.image.avatar(),
        Name: faker.name.findName(),
        Role: 'User',
        UserId: faker.datatype.number(),
      },
      {
        ImageUrl: faker.image.avatar(),
        Name: faker.name.findName(),
        Role: 'User',
        UserId: faker.datatype.number(),
      },
      {
        ImageUrl: faker.image.avatar(),
        Name: faker.name.findName(),
        Role: 'User',
        UserId: faker.datatype.number(),
      },
    ],
    Emoji: ':package:',
    CreateDate: '',
    CreatedBy: '',
    UpdateDate: faker.date.past(1).toString(),
    UpdatedBy: faker.random.words(),
    Status: 'Active',
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

export class CollectionSearchMockDb {
  public static get Collection() {
    return mockCollectionSearch();
  }

  public static get CollectionSearch() {
    return generateRecords(mockCollectionSearch);
  }
}

export class CollectionSearchResponseMockDb {
  public static get CollectionSearchResponse(): SearchResult<CollectionSearch> {
    const Results = CollectionSearchMockDb.CollectionSearch;

    return {
      Aggregations: null,
      Results,
      ResultsTotal: Results.length,
    };
  }

  public static get ProductsSearchResponse(): SearchResult<Product> {
    const Results = Array(50)
      .fill(product)
      .map((product, index) =>
        index === 0
          ? {
              Description: '',
              Id: faker.datatype.number(999999999),
              ImageUrl: 'media/39803014',
              IsDeleted: true,
              Name: faker.commerce.product(),
            }
          : {
              ...product,
              Id: faker.datatype.number(999999999),
            }
      );

    return {
      Aggregations: null,
      Results,
      ResultsTotal: Results.length,
    };
  }

  public static SeededCollectionSearchResponse(
    collections: Collection[]
  ): SearchResult<CollectionSearch> {
    return {
      Aggregations: null,
      Results: collections.map(collectionToSearch),
      ResultsTotal: collections.length,
    };
  }
}

function collectionToSearch(collection: Collection): CollectionSearch {
  return {
    ...mockCollectionSearch(),
    ...collection,
  };
}
