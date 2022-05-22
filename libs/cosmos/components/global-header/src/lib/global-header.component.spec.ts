import { RouterTestingModule } from '@angular/router/testing';
import '@cosmos/layout/resize-observer/mocks/resize-observer';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { CosGlobalHeaderComponent } from './global-header.component';
import { CosGlobalHeaderModule } from './global-header.module';

const navItemsDesktop = [
  {
    id: '1',
    title: 'Dashboard',
    url: '#',
    icon: 'fa fa-tachometer-alt',
  },
  {
    title: 'Collections',
    url: '#',
    icon: 'fa fa-archive',
  },
  {
    title: 'Presentations',
    url: '#',
    icon: 'fa fa-images',
  },
  {
    title: 'Orders',
    url: '#',
    icon: 'fa fa-file-invoice',
  },
  {
    title: 'Notifications',
    url: '#',
    icon: 'fa fa-bell',
    badge: {
      title: 2,
    },
  },
  {
    title: 'Account',
    type: 'collapsable',
    icon: 'fa fa-user-circle',
  },
];
const navItemsMobile = [
  {
    title: 'Collections',
    url: '#',
    icon: 'fa fa-archive',
  },
  {
    title: 'Presentations',
    url: '#',
    icon: 'fa fa-images',
  },
  {
    title: 'Orders',
    url: '#',
    icon: 'fa fa-file-invoice',
  },
  {
    title: 'More',
    type: 'collapsable',
    icon: 'fa fa-bars',
    badge: {
      title: 2,
    },
  },
];

describe('CosGlobalHeaderComponent', () => {
  let spectator: Spectator<CosGlobalHeaderComponent>;

  const createComponent = createComponentFactory({
    component: CosGlobalHeaderComponent,
    imports: [
      RouterTestingModule.withRoutes([]),
      NgxsModule.forRoot(),
      CosGlobalHeaderModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        ariaLabel: 'Main',
        bottomSheetLogoSrc: 'https://placekitten.com/100/25',
        navItemsDesktop,
        navItemsMobile,
      },
    });
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
