import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { FooterComponent, FooterComponentModule } from './footer.component';

describe('FooterComponent', () => {
  let spectator: Spectator<FooterComponent>;
  let component: FooterComponent;

  const createComponent = createComponentFactory({
    component: FooterComponent,
    imports: [FooterComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
