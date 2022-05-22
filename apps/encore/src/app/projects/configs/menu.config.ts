import { NavigationItem } from '@cosmos/layout';

export const ProjectsMenu: NavigationItem[] = [
  {
    id: 'overview',
    title: 'Details',
    url: ['./'],
    type: 'item',
    icon: 'fa fa-info-circle',
  },
  {
    id: 'presentations',
    title: 'Activity & Notes',
    url: ['./activity-notes'],
    type: 'item',
    icon: 'fa fa-bell',
  },
];
