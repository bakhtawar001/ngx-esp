import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  AsiInsufficientPermissionsPage,
  AsiInsufficientPermissionsPageModule,
} from './insufficient-permissions.page';

describe('AsiInsufficientPermissionsPage', () => {
  let spectator: Spectator<AsiInsufficientPermissionsPage>;
  let component: AsiInsufficientPermissionsPage;

  const createComponent = createComponentFactory({
    component: AsiInsufficientPermissionsPage,
    imports: [AsiInsufficientPermissionsPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
