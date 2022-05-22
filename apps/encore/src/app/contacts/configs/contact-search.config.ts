import { SearchFilter } from '@esp/models';

export const CONTACTS_TABS: {
  name: string;
  criteria: {
    status: 'Active' | 'Inactive' | null;
    filters: Record<string, SearchFilter>;
  };
  cssClass: string;
}[] = [
  {
    name: 'All',
    criteria: { status: null, filters: null },
    cssClass: 'all-entities',
  },
  {
    name: `Active`,
    criteria: { status: 'Active', filters: null },
    cssClass: 'active-entities',
  },
  {
    name: 'Owned by me',
    criteria: {
      status: 'Active',
      filters: {
        Owners: {
          terms: [],
          behavior: 'Any',
        },
      },
    },
    cssClass: 'owned-by-me-entities',
  },
  {
    name: 'Shared with me',
    criteria: {
      status: 'Active',
      filters: {
        Owners: {
          terms: [],
          behavior: 'Not',
        },
      },
    },
    cssClass: 'shared-entities',
  },
  {
    name: `Inactive`,
    criteria: { status: 'Inactive', filters: null },
    cssClass: 'inactive-entities',
  },
];
