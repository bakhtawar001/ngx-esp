import { TabFilter } from '@esp/search';

export const tabs: TabFilter[] = [
  { name: 'All', criteria: { status: 'active', type: 'default' } },
  { name: 'Owned by me', criteria: { status: 'active', type: 'me' } },
  { name: 'Shared with me', criteria: { status: 'active', type: 'shared' } },
];
