import { MenuItem } from '../types';

export const navItemsDesktop: MenuItem[] = [
  {
    id: 'dashboard',
    type: 'item',
    title: 'Dashboard',
    icon: 'fa fa-tachometer-alt',
    url: ['#'],
  },
  {
    id: 'feedback',
    type: 'item',
    title: 'Feedback',
    icon: 'fa fa-paper-plane',
    url: ['mailto:Support@Encore-VIP.com?subject=Encore%20Feedback'],
    externalUrl: true,
  },
  {
    id: 'collections',
    type: 'item',
    title: 'Collections',
    icon: 'fa fa-archive',
    menu: null,
  },
  {
    id: 'projects',
    type: 'item',
    title: 'Projects',
    icon: 'fa fa-folder',
    menu: null,
  },
  {
    id: 'websites',
    type: 'item',
    title: 'Websites',
    icon: 'fa fa-laptop',
    url: ['/websites'],
  },
  {
    id: 'directory',
    type: 'item',
    title: 'Directory',
    icon: 'fa fa-address-card',
    url: ['/directory'],
  },
  {
    id: 'notifications',
    type: 'item',
    title: 'Notifications',
    icon: 'fa fa-bell',
    url: ['#'],
  },
  {
    id: 'account',
    type: 'item',
    title: 'Account',
    icon: 'fa fa-user-circle',
    menu: null,
  },
];
