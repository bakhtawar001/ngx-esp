import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MarketingPage, MarketingPageModule } from './marketing.page';

describe('MarketingPage', () => {
  let spectator: Spectator<MarketingPage>;
  let component: MarketingPage;

  const createComponent = createComponentFactory({
    component: MarketingPage,
    imports: [MarketingPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
