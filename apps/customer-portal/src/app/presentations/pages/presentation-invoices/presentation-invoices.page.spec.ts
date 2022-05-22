import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import {
  PresentationInvoicesPage,
  PresentationInvoicesPageModule,
} from './presentation-invoices.page';

describe('PresentationInvoicesPage', () => {
  let spectator: Spectator<PresentationInvoicesPage>;

  const createComponent = createComponentFactory({
    component: PresentationInvoicesPage,

    imports: [RouterTestingModule, PresentationInvoicesPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
