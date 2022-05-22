import { SortOption, TabFilter } from '@esp/search';

export const presentationTabs: TabFilter[] = [
  {
    name: 'Active Presentations',
    criteria: { status: 'active', type: 'default' },
  },
  {
    name: 'Closed Presentations',
    criteria: { status: 'closed', type: 'closed' },
  },
];

export const sortMenuOptions: SortOption[] = [
  {
    name: 'Last Updated',
    value: 'default',
  },
  {
    name: 'Oldest',
    value: 'create_asc',
  },
  {
    name: 'Newest',
    value: 'create_desc',
  },
  {
    name: 'Presentation Name: A-Z',
    value: 'az',
  },
  {
    name: 'Presentation Name: Z-A',
    value: 'za',
  },
];
