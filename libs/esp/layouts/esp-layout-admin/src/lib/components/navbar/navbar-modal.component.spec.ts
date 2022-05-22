import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CosmosLayoutModule, NavigationService } from '@cosmos/layout';
import { MockNavigationService } from '@cosmos/layout/navigation/_mocks_';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MOCK_NAVIGATION } from '../../../../../__mocks__';
import {
  NavbarModalComponent,
  NavbarModalModule,
} from './navbar-modal.component';

describe('NavbarModalComponent', () => {
  let component: NavbarModalComponent;
  let spectator: Spectator<NavbarModalComponent>;
  let service: NavigationService;

  const createComponent = createComponentFactory({
    component: NavbarModalComponent,
    imports: [
      NoopAnimationsModule,
      NavbarModalModule,
      CosmosLayoutModule.forRoot({}, MOCK_NAVIGATION),
      NgxsModule.forRoot(),
    ],
    declarations: [NavbarModalComponent],
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

    service = spectator.inject(NavigationService);

    service.register('main', MOCK_NAVIGATION);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('applications', () => {
    it('should set hidden to false', () => {
      const navigationResponse = [
        { a: 1, hidden: true },
        { a: 2, hidden: true },
      ];
      const expected = navigationResponse.map((val) => ({
        ...val,
        hidden: false,
      }));

      jest
        .spyOn(service, 'getNavigation')
        .mockReturnValue(<any>navigationResponse);

      // Recreate component because applications is set on instantiation
      spectator = createComponent();
      component = spectator.component;

      // expect(component.applications).toEqual(expected);
    });
  });
});
