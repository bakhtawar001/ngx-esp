import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosSlideToggleComponent } from './toggle.component';
import { CosSlideToggleModule } from './toggle.module';

describe('Toggle Component', () => {
  let component: CosSlideToggleComponent;
  let spectator: Spectator<CosSlideToggleComponent>;
  const createComponent = createComponentFactory({
    component: CosSlideToggleComponent,
    imports: [CosSlideToggleModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be true when clicked', () => {
    const elem: any = spectator.query('.cos-slide-toggle-input');
    expect(elem).toHaveProperty('checked', false);
    spectator.click(elem);
    expect(elem).toHaveProperty('checked', true);
  });
});
