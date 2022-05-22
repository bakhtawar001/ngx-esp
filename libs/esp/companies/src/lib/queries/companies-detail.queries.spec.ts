import { NgxsSelectorTestBed } from '@cosmos/testing';
import { CompaniesDetailQueries } from '@esp/companies';
import { EmailType } from '@esp/models';
import { CompaniesState } from '../states';

const givenCompany = {
  Id: 1,
  Emails: [
    {
      Type: EmailType.Work,
    },
    {
      Type: EmailType.Home,
    },
  ],
};
const expectedCompany = {
  ...givenCompany,
  Emails: [
    {
      Type: EmailType.Home,
    },
    { Type: EmailType.Work },
  ],
};

describe('CompaniesDetailQueries', () => {
  it('should sort emails by their type', () => {
    const state = {
      items: {
        [givenCompany.Id]: givenCompany,
      },
      itemIds: [givenCompany.Id],
      currentId: givenCompany.Id,
    };
    const selectorTestBed = new NgxsSelectorTestBed().setState(
      CompaniesState,
      state
    );

    const result = selectorTestBed.getSnapshot(
      CompaniesDetailQueries.getCompany
    );
    expect(result).toEqual(expectedCompany);
  });
});
