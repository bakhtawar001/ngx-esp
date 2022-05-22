import * as faker from 'faker';

const mockSupplier = () => {
  return {
    Id: 3264,
    Name: 'Snugz/USA Inc',
    AsiNumber: '88060',
    Phone: {
      Work: '(801) 274-7346',
      TollFree: '(888) 447-6841',
      Primary: '(888) 447-6840',
      $index: 1,
    },
    Fax: {
      TollFree: '(888) 467-6840',
      Primary: '(888) 467-6840',
      $index: 1,
    },
    Email: 'customercare@snugzusa.com',
    Contacts: [
      { Name: 'Brandon Brown', Title: 'Vice President' },
      { Name: 'Brandon Mackay', Title: 'President' },
      { Name: 'Chris Duncan', Title: 'Graphic Artist' },
      { Name: 'Lindsey Williams' },
      { Name: 'Lori Holdener', Title: 'Credit Manager' },
      { Name: 'RaNell Lefler', Title: 'CFO' },
      { Name: 'Rosanne Webster', Title: 'CIO' },
    ],
    OfficeHours: '8:00-5:00',
    Type: 'Supplier',
    Addresses: {
      Primary: {
        Street1: '9258 S Prosperity Rd',
        City: 'West Jordan',
        State: 'UT',
        Zip: '84081-6161',
        Country: 'USA',
      },
      Delivery: {
        Street1: '9258 S Prosperity Rd',
        City: 'West Jordan',
        State: 'UT',
        Zip: '84081-6161',
        Country: 'USA',
      },
    },
    Phones: [
      {
        Type: 'OfficeFax',
        Number: '(888) 467-6840',
        IsPrimary: true,
        IsTollFree: true,
      },
      { Type: 'OfficePhone', Number: '(801) 274-7346' },
      {
        Type: 'OfficePhone',
        Number: '(888) 447-6840',
        IsPrimary: true,
        IsTollFree: true,
      },
    ],
    LineNames: ['SnugZ USA®'],
    Brands: ['Zen (TM)', 'Traverse (TM)', 'ZIP-IT (TM)'],
    Ratings: {
      OverAll: { Rating: 9, Companies: 41, Transactions: 247 },
      Quality: { Rating: 9, Companies: 36, Transactions: 206 },
      Communication: { Rating: 9, Companies: 35, Transactions: 202 },
      Delivery: { Rating: 9, Companies: 34, Transactions: 201 },
      ConflictResolution: { Rating: 8, Companies: 13, Transactions: 133 },
      Decoration: { Rating: 9, Companies: 34, Transactions: 201 },
    },
    Awards: [
      'Top 50 Supplier 2019',
      'Top 50 Supplier 2018',
      'Top 100 Supplier 2017',
    ],
    Preferred: {
      Rank: 2,
      Name: 'Gold',
      Description: 'EQP applied to Net Cost',
    },
    Artwork: {
      Email: 'artwork@snugzusa.com',
      Comment: 'This is a comment.',
    },
    Orders: {
      Fax: { TollFree: '(888) 467-6840', $index: 1 },
      Email: 'purchase@snugzusa.com',
    },
    ProductionTime: {
      Name: '3-10 Days',
      Days: { From: 3, To: 10, $index: 1 },
    },
    RushTime: { Name: '1 Days', Days: 1 },
    ImprintingMethods: [
      'Deboss',
      'Die Stamp',
      'Digital',
      'Direct Imprint',
      'Four Color Process',
      'Full Color Process',
      'Labels',
      'Laser Engraved',
      'Pad Print',
      'Screen Printing',
      'Spot Color',
      'Sublimation',
    ],
    MarketingPolicy:
      'Supplier indicates they sell advertising specialties exclusively through distributors and/or incentive resellers',
    DistributionPolicy: 'North America (US and Canada)',
    MinorityInvolvement: 'minority',
    IsQcaCertified: false,
    IsCanadian: false,
    IsCanadianFriendly: true,
    HasDistributorAffiliation: false,
    Functions: ['Assembler', 'Importer', 'Imprinter', 'Manufacturer'],
    MultiLineReps: [
      { Name: 'Ball and Black, LLC' },
      { Name: 'Flanagan \u0026 Assoc' },
      { Name: 'Jim Dunn \u0026 Company' },
      { Name: 'Reinecker Marketing Assoc' },
      { Name: 'The Maddox Company' },
      { Name: 'WesCo Marketing' },
    ],
    References: [
      {
        Id: 110932,
        Name: 'Brandvia Alliance Inc',
        AsiNumber: '145037',
        Phone: '(408) 955-0500',
        Contacts: [{ Name: 'Bobbi Levingston' }],
        Transactions: 99,
      },
      {
        Id: 115841,
        Name: 'Sonic Enterprises LLC',
        AsiNumber: '329865',
        Phone: '(301) 869-7800',
        Contacts: [{ Name: 'Seth Weiner' }],
        Transactions: 31,
      },
      {
        Id: 109302,
        Name: 'A C I Printing Services Inc',
        AsiNumber: '101116',
        Phone: '(310) 372-2456',
        Contacts: [{ Name: 'Charla Chase' }],
        Transactions: 14,
      },
      {
        Id: 745865,
        Name: 'Reno Print Store',
        AsiNumber: '307201',
        Phone: '(775) 313-9720',
        Contacts: [{ Name: 'Wendy Marsh' }],
        Transactions: 11,
      },
    ],
    Documentations: [
      {
        Id: 221,
        Name: 'To access: User: snugz, password: user2010',
        Url: 'http://www.snugzusa.com/testing_compliance.asp',
        Type: 'MEDI',
      },
      {
        Id: 221,
        Name: 'To access: User: snugz, password: user2010',
        Url: 'http://www.snugzusa.com/testing_compliance.asp',
        Type: 'LINK',
      },
    ],
    OurStory:
      '6/2019\r\n\r\nMunich, Germany – AccuLink, the largest commercial printer and mail house in eastern North Carolina, will significantly increase their dye sublimation production after investing in the Panthera S4-1.8m, a revolutionary high-speed digital dye sublimation printing system, at the 2019 FESPA Global Print Expo in Munich.\r\n\r\nTom O’Brien, President of AccuLink, based in Greenville, NC, invested in the Panthera through their long-time distribution partner, Randy Peters, President and CEO of The Mosaica Group, based in Sussex, WI. The Mosaica Group is a national distributor supporting dye sublimation and wide format print processes with equipment, consumables, and services, and is the exclusive distributor of the Panthera in North America and Canada.',
    ShippingPoints: [
      {
        IsFOB: true,
        City: 'Salt Lake City',
        State: 'UT',
        Zip: '84104',
        Country: 'USA',
      },
      {
        IsFOB: true,
        City: 'Cranston',
        State: 'RI',
        Zip: '02920',
        Country: 'USA',
      },
      {
        IsFOB: true,
        City: 'Minneapolis',
        State: 'MN',
        Zip: '55428',
        Country: 'USA',
      },
      {
        IsFOB: true,
        City: 'Verona',
        State: 'WI',
        Zip: '53593',
        Country: 'USA',
      },
      {
        IsFOB: true,
        City: 'North Logan',
        State: 'UT',
        Zip: '84341',
        Country: 'USA',
      },
      {
        IsFOB: true,
        City: 'El Segundo',
        State: 'CA',
        Zip: '90245',
        Country: 'USA',
      },
      {
        IsFOB: true,
        City: 'West Jordan',
        State: 'UT',
        Zip: '84081',
        Country: 'USA',
      },
      {
        IsFOB: true,
        City: 'Rosedale',
        State: 'MD',
        Zip: '21230',
        Country: 'USA',
      },
      {
        IsFOB: true,
        City: 'Sun Prairie',
        State: 'WI',
        Zip: '53590',
        Country: 'USA',
      },
      {
        IsFOB: true,
        City: 'Los Angeles',
        State: 'CA',
        Zip: '90245',
        Country: 'USA',
      },
      {
        IsFOB: true,
        City: 'City of Industry',
        State: 'CA',
        Zip: '91744',
        Country: 'USA',
      },
      {
        IsFOB: true,
        City: 'Keene',
        State: 'NH',
        Zip: '03431',
        Country: 'USA',
      },
    ],
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

export class SuppliersMockDb {
  public static get suppliers() {
    return generateRecords(mockSupplier);
  }
}
