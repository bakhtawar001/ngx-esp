import { InjectionToken } from '@angular/core';
import { NavigationItem } from '@cosmos/layout';

export const CONTACT_MENU = new InjectionToken<NavigationItem[]>(
  'COMPANY_MENU'
);

export const ContactMenu: NavigationItem[] = [
  {
    id: 'details',
    title: 'Details',
    type: 'item',
    icon: 'fa fa-address-card',
    url: ['details'],
  },
  {
    id: 'notes',
    title: 'Notes',
    type: 'item',
    icon: 'fa fa-sticky-note',
    url: ['notes'],
  },
];
