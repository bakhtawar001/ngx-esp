import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import {
  PresentationQuotesPage,
  PresentationQuotesPageModule,
} from './presentation-quotes.page';

describe('PresentationQuotesPage', () => {
  let spectator: Spectator<PresentationQuotesPage>;

  const createComponent = createComponentFactory({
    component: PresentationQuotesPage,

    imports: [RouterTestingModule, PresentationQuotesPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
