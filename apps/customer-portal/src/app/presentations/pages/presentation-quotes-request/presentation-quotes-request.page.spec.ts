import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import {
  PresentationQuoteRequestPage,
  PresentationQuoteRequestPageModule,
} from './presentation-quotes-request.page';

describe('PresentationQuoteRequestPage', () => {
  let spectator: Spectator<PresentationQuoteRequestPage>;

  const createComponent = createComponentFactory({
    component: PresentationQuoteRequestPage,

    imports: [RouterTestingModule, PresentationQuoteRequestPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
