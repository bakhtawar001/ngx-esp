import type { SortOption } from '@esp/search';

export const COMPANIES_SORT_OPTIONS: SortOption[] = [
  {
    name: 'Name (A to Z)',
    value: "{ firstCharacter: 'asc', name: 'asc' }",
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
