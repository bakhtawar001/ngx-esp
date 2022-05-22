import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  ProjectOverviewPage,
  ProjectOverviewPageModule,
} from './project-overview.page';

describe('ProjectOverviewPage', () => {
  let spectator: Spectator<ProjectOverviewPage>;
  let component: ProjectOverviewPage;

  const createComponent = createComponentFactory({
    component: ProjectOverviewPage,
    imports: [
      ProjectOverviewPageModule,
      RouterTestingModule,
      NgxsModule.forRoot(),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
