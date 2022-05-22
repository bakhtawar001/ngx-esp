import { NavigationItem } from '@cosmos/layout';

export const ProjectTabsMenu: NavigationItem[] = [
  {
    id: 'overview',
    title: 'Overview',
    url: ['./'],
    type: 'item',
    exactMatch: true,
  },
  {
    id: 'presentations',
    title: 'Presentations',
    url: ['./presentations'],
    type: 'item',
  },
  {
    id: 'orders',
    title: 'Quotes & Orders',
    url: ['./orders'],
    type: 'item',
  },
  { id: 'proofs', title: 'Proofs', url: ['./proofs'], type: 'item' },
  {
    id: 'communications',
    title: 'Communications',
    url: ['./communications'],
    type: 'item',
  },
  { id: 'notes', title: 'Notes', url: ['./notes'], type: 'item' },
];
