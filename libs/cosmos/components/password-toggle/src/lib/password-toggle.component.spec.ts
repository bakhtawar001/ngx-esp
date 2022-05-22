import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  CosPasswordToggleComponent,
  CosPasswordToggleComponentModule,
} from './password-toggle.component';

describe('CosPasswordToggleComponent', () => {
  let spectator: Spectator<CosPasswordToggleComponent>;
  let component: CosPasswordToggleComponent;

  const createComponent = createComponentFactory({
    component: CosPasswordToggleComponent,
    imports: [CosPasswordToggleComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
