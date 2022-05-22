import { MatNativeDateModule } from '@angular/material/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  ProjectProofsPage,
  ProjectProofsPageModule,
} from './project-proofs.page';

describe('ProjectProofsPage', () => {
  let spectator: Spectator<ProjectProofsPage>;
  let component: ProjectProofsPage;

  const createComponent = createComponentFactory({
    component: ProjectProofsPage,
    imports: [ProjectProofsPageModule, MatNativeDateModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
