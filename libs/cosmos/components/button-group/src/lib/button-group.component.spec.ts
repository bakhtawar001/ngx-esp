import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosButtonGroupComponent } from './button-group.component';
import { CosButtonGroupModule } from './button-group.module';

describe('ButtonGroupComponent', () => {
  let component: CosButtonGroupComponent;
  let spectator: Spectator<CosButtonGroupComponent>;

  const createComponent = createComponentFactory({
    component: CosButtonGroupComponent,
    imports: [CosButtonGroupModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.query('.cos-button-group')).toBeTruthy();
  });
});
