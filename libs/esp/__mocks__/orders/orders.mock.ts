import * as faker from 'faker/locale/en_US';

import { Order } from '@esp/models';

// import { Availability, Location, Place } from '../models';
// import { oneLocation } from './location';
// import { availabilities } from './availability';

const mockOrder = (): Order => {
  const timezone = faker.random.arrayElement([
    'America/New_York',
    'America/Los_Angeles',
  ]);

  return {
    Id: faker.datatype.number(),
    Type: faker.random.arrayElement([
      'order',
      'invoice',
      'quote',
      'samplerequest',
    ]),
    Number: faker.datatype.number({ min: 10000 }).toString(),
    // Customer: faker.company.companyName(),
    Date: faker.date.past().toISOString(),
    InHandsDate: faker.date.past().toISOString(),
    // Total: faker.datatype.number({ precision: 2 }),
    AmountDue: faker.datatype.number({ precision: 2 }),
    CurrencySymbol: faker.finance.currencySymbol(),
    Status: faker.random.arrayElement(['Active', 'Inactive']),
    // address: oneLocation(timezone),
    // timezone,
    // availabilities: availabilities(),
  } as Order;
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

export class OrdersMockDb {
  public static get orders() {
    return generateRecords(mockOrder);
  }
}
