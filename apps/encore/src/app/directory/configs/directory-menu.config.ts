import { InjectionToken } from '@angular/core';
import { NavigationItem } from '@cosmos/layout';

export const DIRECTORY_MENU = new InjectionToken<NavigationItem[]>(
  'Directory left navigation'
);

export const DirectoryMenu: NavigationItem[] = [
  {
    id: 'companies-group',
    title: 'Companies',
    type: 'group',
    children: [
      {
        id: 'companies',
        title: 'All Companies',
        type: 'item',
        icon: 'fa fa-building',
        url: ['companies'],
        queryParamsHandling: 'merge',
        queryParams: {
          page: null,
          filters: null,
        },
      },
      {
        id: 'customers',
        title: 'Customers',
        type: 'item',
        icon: 'fa fa-users',
        url: ['customers'],
        queryParamsHandling: 'merge',
        queryParams: {
          page: null,
          filters: null,
        },
      },
      {
        id: 'suppliers',
        title: 'Suppliers',
        type: 'item',
        icon: 'fa fa-industry',
        url: ['suppliers'],
        queryParamsHandling: 'merge',
        queryParams: {
          page: null,
          filters: null,
        },
      },
      {
        id: 'decorators',
        title: 'Decorators',
        type: 'item',
        icon: 'fa fa-palette',
        url: ['decorators'],
        queryParamsHandling: 'merge',
        queryParams: {
          page: null,
          filters: null,
        },
      },
    ],
  },
  {
    id: 'contacts-group',
    title: 'Contacts',
    type: 'group',
    children: [
      {
        id: 'contacts',
        title: 'Contacts',
        type: 'item',
        icon: 'fa fa-address-card',
        url: ['contacts'],
        queryParamsHandling: 'merge',
      },
    ],
  },
];
