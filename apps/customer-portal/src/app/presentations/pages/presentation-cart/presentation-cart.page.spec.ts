import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import {
  PresentationCartPage,
  PresentationCartPageModule,
} from './presentation-cart.page';

describe('PresentationCartPage', () => {
  let spectator: Spectator<PresentationCartPage>;

  const createComponent = createComponentFactory({
    component: PresentationCartPage,

    imports: [RouterTestingModule, PresentationCartPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
