import * as faker from 'faker/locale/en_US';

import { Company } from '@esp/models';

const mockCompany = (): Company => {
  return ({
    Creator: {
      Id: faker.datatype.number(),
      IsActive: faker.datatype.boolean(),
      Name: faker.random.words(),
    },
    Owner: {
      Id: faker.datatype.number(),
      IsActive: faker.datatype.boolean(),
      Name: faker.random.words(),
    },
    Websites: [],
    Emails: faker.random.arrayElement([
      {
        Id: faker.datatype.number(),
        Address: faker.internet.email().toString(),
        IsPrimary: faker.datatype.boolean(),
        Type: faker.random.arrayElement(['Work', 'Order']),
      },
    ]),
    IsCompany: faker.datatype.boolean(),
    IsPerson: faker.datatype.boolean(),
    Phones: [],
    Addresses: [],
    Tags: [],
    Version: faker.datatype.number(),
    LastActivityDate: '',
    UpdateDate: '',
    CreateDate: faker.date.past(),
    ProfileImageUrl: faker.image.avatar().toString(),
    IsActive: faker.datatype.boolean(),
    Name: faker.random.words(),
    Id: faker.datatype.number(),
    ExternalId: faker.datatype.number(),
    ExternalRecordId: faker.datatype.number().toString(),
    Code: faker.random.word().toUpperCase(),
    Currency: faker.random.arrayElement(['USD', 'CAD']),
    TaxCode: faker.datatype.number(),
    CreditLimit: faker.datatype.number({ max: 100 }),
    DefaultDiscount: faker.datatype.number({ max: 50 }),
    AsiNumber: faker.datatype.number().toString(),
    BillingContact: [],
    ShippingContact: [],
    AcknowledgementContact: {
      Id: 500418499,
      IsPerson: true,
      IsProspect: false,
      Name: 'Phil Bill',
      Owner: { Id: 0 },
      Type: 'Acknowledgement',
    },
    DefaultSalesPerson: faker.lorem.words(),
    CreditTerms: [],
    Decorations: [],
    PaymentMethods: [],
    ShippingAccounts: [],
    Links: [],
    IsCustomer: faker.datatype.boolean(),
    IsSupplier: faker.datatype.boolean(),
    IsDecorator: faker.datatype.boolean(),
    IsProspect: faker.datatype.boolean(),
    IsAsiMember: faker.datatype.boolean(),
    EmailDomains: [],
    CanEditVisibility: faker.datatype.boolean(),
    IsTaxExempt: faker.datatype.boolean(),
    TaxCertificates: [],
    WebsiteContactCount: faker.datatype.number({ max: 30 }),
    ProofType: faker.random.arrayElement(['Blank', 'Electronic']),
    ProofEmail: faker.internet.email(),
  } as unknown) as Company;
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

export class CompaniesMockDb {
  public static get Companies() {
    return generateRecords(mockCompany);
  }
}

export class CompaniesSearchMockDb {
  public static get SearchResponse() {
    const Results = CompaniesMockDb.Companies;
    return {
      Results,
      ResultsTotal: Results.length,
      Aggregations: null,
    };
  }
}
