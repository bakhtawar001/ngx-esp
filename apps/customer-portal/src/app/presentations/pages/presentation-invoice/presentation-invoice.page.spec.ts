import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import {
  PresentationInvoicePage,
  PresentationInvoicePageModule,
} from './presentation-invoice.page';

describe('PresentationInvoicePage', () => {
  let spectator: Spectator<PresentationInvoicePage>;

  const createComponent = createComponentFactory({
    component: PresentationInvoicePage,

    imports: [RouterTestingModule, PresentationInvoicePageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
