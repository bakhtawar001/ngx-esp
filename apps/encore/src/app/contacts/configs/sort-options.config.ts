import type { SortOption } from '@esp/search';

export const CONTACTS_SORT_OPTIONS: SortOption[] = [
  {
    name: 'First Name (A to Z)',
    value: "{ firstCharacter: 'asc', firstName:'asc' }",
  },
  {
    name: 'Last Name (A to Z)',
    value: "{ lastNameFirstCharacter: 'asc', lastName: 'asc' }",
  },
  {
    name: 'Date Added',
    value: "{ createDate: 'desc' }",
  },
  {
    name: 'Last Activity Date',
    value: "{ lastActivityDate: 'desc' }",
  },
];
