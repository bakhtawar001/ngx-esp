import { BottomSheetMenuComponent } from '../components/bottom-sheet-menu/bottom-sheet-menu.component';
import { MenuItem } from '../types';

export const navItemsMobile: MenuItem[] = [
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
    url: ['/collections'],
  },
  {
    id: 'projects',
    type: 'item',
    title: 'Projects',
    icon: 'fa fa-folder',
    url: ['/projects'],
    featureFlags: ['projects'],
  },
  {
    id: 'websites',
    type: 'item',
    title: 'Websites',
    icon: 'fa fa-laptop',
    url: ['/websites'],
    featureFlags: ['websites'],
  },
  {
    id: 'directory',
    type: 'item',
    title: 'Directory',
    icon: 'fa fa-address-card',
    url: ['/directory'],
  },
  {
    id: 'more',
    type: 'collapsable',
    title: 'More',
    icon: 'fa fa-bars',
    component: BottomSheetMenuComponent,
  },
];
