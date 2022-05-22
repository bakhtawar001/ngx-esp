import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { WhitelabelPage, WhitelabelPageModule } from './whitelabel.page';

describe('WhitelabelPage', () => {
  let spectator: Spectator<WhitelabelPage>;
  let component: WhitelabelPage;

  const createComponent = createComponentFactory({
    component: WhitelabelPage,
    imports: [WhitelabelPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
