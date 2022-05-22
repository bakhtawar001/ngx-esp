import { APP_BASE_HREF } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { CosmosLayoutModule, NavigationService } from '@cosmos/layout';
import { MockNavigationService } from '@cosmos/layout/navigation/_mocks_';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MOCK_NAVIGATION } from '../../../../../__mocks__';
import { NavbarComponent } from './navbar.component';
import { NavbarModule } from './navbar.module';

describe('NavbarComponent', () => {
  let spectator: Spectator<NavbarComponent>;
  let component: NavbarComponent;

  const createComponent = createComponentFactory({
    component: NavbarComponent,
    imports: [
      RouterTestingModule,
      CosmosLayoutModule.forRoot({ layout: {} }, MOCK_NAVIGATION),
      NavbarModule,
      NgxsModule.forRoot(),
    ],
    declarations: [NavbarComponent],
    providers: [
      {
        provide: APP_BASE_HREF,
        useValue: '',
      },
      {
        provide: NavigationService,
        useFactory: () => new MockNavigationService(MOCK_NAVIGATION),
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    const service = spectator.inject(NavigationService);

    service.register('main', MOCK_NAVIGATION);
  });

  it('works', () => {
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
