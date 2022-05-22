import { SortOption } from '@esp/search';

export const sortOptions: SortOption[] = [
  {
    name: 'Last Updated',
    value: 'default',
  },
  {
    name: 'Oldest',
    value: 'createdate_asc',
  },
  {
    name: 'Newest',
    value: 'createdate_desc',
  },
  {
    name: 'Name A-Z',
    value: 'az',
  },
  {
    name: 'Name Z-A',
    value: 'za',
  },
];
