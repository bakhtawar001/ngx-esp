import { RouterTestingModule } from '@angular/router/testing';
import { NavigationItem } from '@cosmos/layout';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosVerticalMenuComponent } from './vertical-menu.component';
import { CosVerticalMenuModule } from './vertical-menu.module';

const children = [
  {
    id: 'profile',
    title: 'Profile and login settings',
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
];

const props = {
  label: 'Settings menu',
  activeItem: children[0],
  menu: [
    {
      id: 'basic-settings',
      title: 'Basic Settings',
      type: 'group',
      children,
    },
  ],
} as { label: string; menu: NavigationItem[] };

describe('CosVerticalMenuComponent', () => {
  let component: CosVerticalMenuComponent;
  let spectator: Spectator<CosVerticalMenuComponent>;
  const createComponent = createComponentFactory({
    component: CosVerticalMenuComponent,
    imports: [RouterTestingModule, CosVerticalMenuModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props,
    });
    component = spectator.component;
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });
});
