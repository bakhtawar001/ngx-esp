import { Contact } from '@esp/models';
import * as faker from 'faker';

const mockContact = (): Contact => {
  const GivenName = faker.name.firstName();
  const FamilyName = faker.name.lastName();

  return {
    GivenName,
    FamilyName,
    Name: `${GivenName} ${FamilyName}`,
    IsUser: faker.datatype.boolean(),
    IsSalesPerson: faker.datatype.boolean(),
    IsProspect: faker.datatype.boolean(),
    Title: faker.name.jobTitle(),
    Links: [
      {
        Id: faker.datatype.number(),
        IsEditbale: true,
        Title: faker.name.jobTitle(),
        Comment: '',
        Type: null,
      },
    ],
    Creator: null, //faker.name.findName(),
    Owner: null, //faker.name.findName(),
    Websites: [],
    Emails: [],
    Phones: [],
    Addresses: [],
    Tags: [],
    Version: null,
    LastActivityDate: null,
    CreateDate: null,
    UpdateDate: null,
    ProfileImageUrl: null,
    IsActive: faker.datatype.boolean(),
    Id: faker.datatype.number(),
    IsEditable: faker.datatype.boolean(),
    IsVisible: faker.datatype.boolean(),
    IsCompany: faker.datatype.boolean(),
    IsPerson: faker.datatype.boolean(),
    TenantId: faker.datatype.number(),
    ExternalId: faker.datatype.number(),
    OwnerId: faker.datatype.number(),
    ExternalRecordId: faker.datatype.number().toString(),
    AccessLevel: null,
    Access: null,
  };
};

const generateRacords = (
  generator: any,
  size = faker.datatype.number({ min: 50, max: 200 })
) => {
  const res = [];

  for (let i = 0; i < size; i++) {
    res.push(generator());
  }

  return res;
};

export class ContactsMockDb {
  public static get Contacts() {
    return generateRacords(mockContact);
  }
}

export class ContactsSearchMockDb {
  public static get SearchResponse() {
    const Results = ContactsMockDb.Contacts;
    return {
      Results,
      ResultsTotal: Results.length,
      Aggregations: null,
    };
  }
}
