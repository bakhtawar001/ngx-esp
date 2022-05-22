import { InjectionToken } from '@angular/core';
import { NavigationItem } from '@cosmos/layout';

export const COMPANY_MENU = new InjectionToken<NavigationItem[]>(
  'COMPANY_MENU'
);

export const CompanyMenu: NavigationItem[] = [
  {
    id: 'activity',
    title: 'Activity',
    type: 'item',
    icon: 'fa fa-bell',
    url: ['activity'],
  },
  {
    id: 'details',
    title: 'Details',
    type: 'item',
    icon: 'fa fa-address-card',
    url: ['details'],
  },
  {
    id: 'contacts',
    title: 'Contacts',
    type: 'item',
    icon: 'fa fa-user',
    url: ['contacts'],
  },
  {
    id: 'product-history',
    title: 'Product History',
    type: 'item',
    icon: 'fa fa-history',
    url: ['product-history'],
  },
  {
    id: 'projects',
    title: 'Projects',
    type: 'item',
    icon: 'fa fa-folder',
    url: ['projects'],
  },
  {
    id: 'notes',
    title: 'Notes',
    type: 'item',
    icon: 'fa fa-sticky-note',
    url: ['notes'],
  },
  {
    id: 'artwork',
    title: 'Artwork',
    type: 'item',
    icon: 'fa fa-palette',
    url: ['artwork'],
  },
  {
    id: 'decorations',
    title: 'Decorations',
    type: 'item',
    icon: 'fa fa-stamp',
    url: ['decorations'],
  },
];
