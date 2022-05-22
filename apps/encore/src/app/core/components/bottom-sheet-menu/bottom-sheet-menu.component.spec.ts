import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthFacade } from '@esp/auth';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import {
  BottomSheetMenuComponent,
  BottomSheetMenuComponentModule,
} from './bottom-sheet-menu.component';

describe('BottomMobileMenuComponent', () => {
  let component: BottomSheetMenuComponent;
  let spectator: Spectator<BottomSheetMenuComponent>;

  const createComponent = createComponentFactory({
    component: BottomSheetMenuComponent,
    imports: [
      BottomSheetMenuComponentModule,
      RouterTestingModule.withRoutes([]),
    ],
    providers: [
      mockProvider(AuthFacade, {
        logout: jest.fn(),
      }),
      mockProvider(MatDialog),
      { provide: MatBottomSheetRef, useValue: {} },
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
});
