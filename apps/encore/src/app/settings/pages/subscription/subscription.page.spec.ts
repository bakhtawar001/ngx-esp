import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SubscriptionPage, SubscriptionPageModule } from './subscription.page';

describe('SubscriptionPage', () => {
  let spectator: Spectator<SubscriptionPage>;
  let component: SubscriptionPage;

  const createComponent = createComponentFactory({
    component: SubscriptionPage,
    imports: [SubscriptionPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
