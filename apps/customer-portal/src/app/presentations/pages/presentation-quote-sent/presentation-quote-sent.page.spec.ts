import { createComponentFactory, Spectator } from '@ngneat/spectator';
import {
  PresentationQuoteSentPage,
  PresentationQuoteSentPageModule,
} from './presentation-quote-sent.page';

describe('PresentationQuoteSentPage', () => {
  let spectator: Spectator<PresentationQuoteSentPage>;

  const createComponent = createComponentFactory({
    component: PresentationQuoteSentPage,

    imports: [PresentationQuoteSentPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
