import { NavigationItem } from '@cosmos/layout';

export const SettingsMenu: NavigationItem[] = [
  {
    id: 'basic-settings',
    title: 'Basic Settings',
    type: 'group',
    children: [
      {
        id: 'profile',
        title: 'Profile and Login Settings',
        type: 'item',
        icon: 'fa fa-user',
        url: ['profile'],
      },
      {
        id: 'notifications',
        title: 'Notification settings',
        type: 'item',
        icon: 'fa fa-bell',
        url: ['notifications'],
      },
      {
        id: 'marketing',
        title: 'Marketing and promotions',
        type: 'item',
        icon: 'fa fa-bullhorn',
        url: ['marketing'],
      },
    ],
  },
  {
    id: 'company-settings',
    title: 'Company Settings',
    type: 'group',
    children: [
      {
        id: 'company',
        title: 'Company Information',
        type: 'item',
        icon: 'fa fa-building',
        url: ['company'],
      },
      {
        id: 'subscription',
        title: 'Subscription and billing',
        type: 'item',
        icon: 'fa fa-sync-alt',
        url: ['subscription'],
      },
      {
        id: 'manage-users',
        title: 'Manage users',
        type: 'item',
        icon: 'fa fa-user-friends',
        url: ['users'],
      },
      {
        id: 'manage-teams',
        title: 'Manage teams',
        type: 'item',
        icon: 'fa fa-users',
        url: ['teams'],
      },
      {
        id: 'white-label',
        title: 'White label settings',
        type: 'item',
        icon: 'fa fa-stamp',
        url: ['whitelabel'],
      },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    type: 'group',
    children: [
      {
        id: 'integrations-accounting',
        title: 'Accounting integrations',
        type: 'item',
        icon: 'fa fa-calculator',
        url: ['integrations/accounting'],
      },
      {
        id: 'integrations-social',
        title: 'Social media integrations',
        type: 'item',
        icon: 'fa fa-headset',
        url: ['integrations/social'],
      },
      {
        id: 'integrations-partners',
        title: 'Partner credentials',
        type: 'item',
        icon: 'fa fa-hands-helping',
        url: ['integrations/partners'],
      },
    ],
  },
  {
    id: 'sales-management',
    title: 'Sales management',
    type: 'group',
    children: [
      {
        id: 'privacy',
        title: 'Activity privacy',
        type: 'item',
        icon: 'fa fa-lock',
        url: ['privacy'],
      },
      {
        id: 'tracking',
        title: 'Order and Presentation tracking',
        type: 'item',
        icon: 'fa fa-bullseye',
        url: ['tracking'],
      },
      {
        id: 'orders',
        title: 'Order creation defaults',
        type: 'item',
        icon: 'fa fa-file-invoice',
        url: ['orders'],
      },
      {
        id: 'sales-tax',
        title: 'Sales tax',
        type: 'item',
        icon: 'fa fa-percent',
        url: ['sales-tax'],
      },
      {
        id: 'templates',
        title: 'Email and message templates',
        type: 'item',
        icon: 'fa fa-at',
        url: ['templates'],
      },
    ],
  },
];
