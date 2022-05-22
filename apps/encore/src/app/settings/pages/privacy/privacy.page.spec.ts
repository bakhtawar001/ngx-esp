import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PrivacyPage, PrivacyPageModule } from './privacy.page';

describe('PrivacyPage', () => {
  let component: PrivacyPage;
  let spectator: Spectator<PrivacyPage>;

  const createComponent = createComponentFactory({
    component: PrivacyPage,
    imports: [PrivacyPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
