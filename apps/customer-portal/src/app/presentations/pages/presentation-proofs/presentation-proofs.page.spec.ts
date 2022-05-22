import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import {
  PresentationProofsPage,
  PresentationProofsPageModule,
} from './presentation-proofs.page';

describe('PresentationProofsPage', () => {
  let spectator: Spectator<PresentationProofsPage>;

  const createComponent = createComponentFactory({
    component: PresentationProofsPage,

    imports: [RouterTestingModule, PresentationProofsPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
