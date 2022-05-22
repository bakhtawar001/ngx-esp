import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { NgxsModule } from '@ngxs/store';
import {
  PresentationProofsEditPage,
  PresentationProofsEditPageModule
} from './presentation-proofs-edit.page';

describe('PresentationProofsEditPage', () => {
  let spectator: Spectator<PresentationProofsEditPage>;

  const createComponent = createComponentFactory({
    component: PresentationProofsEditPage,
    imports: [
      PresentationProofsEditPageModule,
      HttpClientTestingModule,
      RouterTestingModule,
      NgxsModule.forRoot(),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
