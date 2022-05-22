import type { TabFilter } from '@esp/search';

export const tabs: TabFilter[] = [
  { name: 'All Collections', criteria: { status: 'active', type: 'default' } },
  { name: 'Owned by me', criteria: { status: 'active', type: 'me' } },
  { name: 'Shared with me', criteria: { status: 'active', type: 'shared' } },
  { name: 'Archived', criteria: { status: 'archived', type: null } },
];
