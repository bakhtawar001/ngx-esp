import { createComponentFactory, Spectator } from '@ngneat/spectator';
import {
  PresentationActivityPage,
  PresentationActivityPageModule,
} from './presentation-activity.page';

describe('PresentationActivityPage', () => {
  let spectator: Spectator<PresentationActivityPage>;

  const createComponent = createComponentFactory({
    component: PresentationActivityPage,

    imports: [PresentationActivityPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
