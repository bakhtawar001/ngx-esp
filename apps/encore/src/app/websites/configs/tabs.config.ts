import { NavigationItem } from '@cosmos/layout';

export const WebsiteTabsMenu: NavigationItem[] = [
  {
    id: 'overview',
    title: 'Overview',
    url: ['./'],
    type: 'item',
    exactMatch: true,
  },
  {
    id: 'template',
    title: 'Template',
    url: ['./template'],
    type: 'item',
  },
  {
    id: 'orders',
    title: 'Products',
    url: ['./products'],
    type: 'item',
  },
  { id: 'pages', title: 'Pages', url: ['./pages'], type: 'item' },
  {
    id: 'ordermanagement',
    title: 'Order Management',
    url: ['./orders'],
    type: 'item',
  },
  { id: 'settings', title: 'Settings', url: ['./settings'], type: 'item' },
];
