import { NavigationItem } from '@cosmos/layout';

export const OrderDetailMenu: NavigationItem[] = [
  {
    id: 'products',
    title: 'Products & Pricing',
    url: ['./products'],
    type: 'item',
    icon: 'fas fa-shopping-cart',
  },
  {
    id: 'decoration',
    title: 'Decoration',
    url: ['./decoration'],
    type: 'item',
    icon: 'fa fa-paint-brush',
  },
  {
    id: 'shipping',
    title: 'Shipping',
    url: ['./shipping'],
    type: 'item',
    icon: 'fa fa-truck',
  },
  {
    id: 'po',
    title: 'Purchase Orders',
    url: ['./po'],
    type: 'item',
    icon: 'fa fa-file-invoice',
  },
  {
    id: 'payments',
    title: 'Payments & Invoices',
    url: ['./payments'],
    type: 'item',
    icon: 'fa fa-file-invoice-dollar',
  },
];
