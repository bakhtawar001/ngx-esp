import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosNewButtonComponent } from './new-button.component';
import { CosNewButtonModule } from './new-button.module';

describe('CosNewButtonComponent', () => {
  let component: CosNewButtonComponent;
  let spectator: Spectator<CosNewButtonComponent>;
  const createComponent = createComponentFactory({
    component: CosNewButtonComponent,
    imports: [CosNewButtonModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
