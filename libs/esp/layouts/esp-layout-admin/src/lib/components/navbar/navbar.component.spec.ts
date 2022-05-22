import { RouterTestingModule } from '@angular/router/testing';
import { CosmosLayoutModule, NavigationService } from '@cosmos/layout';
import { MockNavigationService } from '@cosmos/layout/navigation/_mocks_';
import '@cosmos/layout/resize-observer/mocks/resize-observer';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MOCK_NAVIGATION } from '../../../../../__mocks__';
import { NavbarComponent } from './navbar.component';
import { NavbarModule } from './navbar.module';

describe('NavBarComponent', () => {
  let component: NavbarComponent;
  let spectator: Spectator<NavbarComponent>;

  const createComponent = createComponentFactory({
    component: NavbarComponent,
    imports: [
      RouterTestingModule,
      CosmosLayoutModule.forRoot({ layout: {} }, MOCK_NAVIGATION),
      NgxsModule.forRoot(),
      NavbarModule,
    ],
    providers: [
      {
        provide: NavigationService,
        useFactory: () => new MockNavigationService(MOCK_NAVIGATION),
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
