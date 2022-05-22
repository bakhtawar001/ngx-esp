import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import {
  PresentationOrdersPage,
  PresentationOrdersPageModule,
} from './presentation-orders.page';

describe('PresentationOrdersPage', () => {
  let spectator: Spectator<PresentationOrdersPage>;

  const createComponent = createComponentFactory({
    component: PresentationOrdersPage,

    imports: [RouterTestingModule, PresentationOrdersPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
