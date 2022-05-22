import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogService } from '@cosmos/core';
import { AuthFacade } from '@esp/auth';
import {
  byTextContent,
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import {
  AsiUserMenuComponent,
  AsiUserMenuComponentModule,
} from './user-menu.component';

describe('AsiUserMenuComponent', () => {
  let component: AsiUserMenuComponent;
  let spectator: Spectator<AsiUserMenuComponent>;

  const createComponent = createComponentFactory({
    component: AsiUserMenuComponent,
    imports: [AsiUserMenuComponentModule, RouterTestingModule.withRoutes([])],
    providers: [
      mockProvider(AuthFacade, {
        logout: jest.fn(),
      }),
      mockProvider(MatDialog),
      mockProvider(DialogService),
    ],
    overrideModules: [
      [
        MatMenuModule,
        {
          set: {
            declarations: MockComponents(MatMenu),
            exports: MockComponents(MatMenu),
          },
        },
      ],
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {},
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open license agreement dialog', () => {
    const licenseButton = spectator.query(
      byTextContent('License Agreement', {
        selector: '.cos-menu-item',
      })
    );
    const service = spectator.inject(DialogService);
    jest.spyOn(service, 'open').mockReturnValue(of());
    spectator.click(licenseButton);

    expect(service.open).toHaveBeenCalled();
  });
});
