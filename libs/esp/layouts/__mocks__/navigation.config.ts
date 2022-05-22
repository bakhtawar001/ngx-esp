import { NavigationItem } from '@cosmos/layout';

export const MOCK_NAVIGATION: NavigationItem[] = [
  {
    id: 'companies',
    title: 'Companies',
    translate: 'NAV.COMPANIES',
    type: 'item',
    icon: 'domain',
    url: ['/companies'],
  },
  {
    id: 'contacts',
    title: 'Contacts',
    translate: 'NAV.CONTACTS',
    type: 'item',
    icon: 'people',
    url: ['/contacts'],
  },
];
