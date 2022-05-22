import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import {
  PresentationOrdersShippedPage,
  PresentationOrdersShippedPageModule,
} from './presentation-orders-shipped.page';

describe('PresentationOrdersShippedPage', () => {
  let spectator: Spectator<PresentationOrdersShippedPage>;

  const createComponent = createComponentFactory({
    component: PresentationOrdersShippedPage,

    imports: [RouterTestingModule, PresentationOrdersShippedPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
