import type { TabFilter } from '@esp/search';

export const tabs: TabFilter[] = [
  { name: 'All Projects', criteria: { status: '', type: 'default' } },
  { name: 'Owned by me', criteria: { status: '', type: 'me' } },
  { name: 'Shared with me', criteria: { status: '', type: 'shared' } },
];
