import { NgxsSelectorTestBed } from '@cosmos/testing';
import { EmailType } from '@esp/models';
import { ContactsDetailQueries } from '../queries';
import { ContactsState } from '../states';

const givenContact = {
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
const expectedContact = {
  ...givenContact,
  Emails: [
    {
      Type: EmailType.Home,
    },
    { Type: EmailType.Work },
  ],
};

describe('ContactsDetailQueries', () => {
  it('should sort emails of the contact by email type', () => {
    const state = {
      items: {
        [givenContact.Id]: givenContact,
      },
      itemIds: [givenContact.Id],
      currentId: givenContact.Id,
    };
    const selectorTestBed = new NgxsSelectorTestBed().setState(
      ContactsState,
      state
    );

    const result = selectorTestBed.getSnapshot(
      ContactsDetailQueries.getContact
    );
    expect(result).toEqual(expectedContact);
  });
});
