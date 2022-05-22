import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import {
  PresentationDetailPage,
  PresentationDetailPageModule,
} from './presentation-detail.page';

describe('PresentationDetailPage', () => {
  let spectator: Spectator<PresentationDetailPage>;

  const createComponent = createComponentFactory({
    component: PresentationDetailPage,

    imports: [RouterTestingModule, PresentationDetailPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
