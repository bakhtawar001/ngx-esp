import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ProjectNotesPage, ProjectNotesPageModule } from './project-notes.page';

describe('ProjectNotesPage', () => {
  let spectator: Spectator<ProjectNotesPage>;
  let component: ProjectNotesPage;

  const createComponent = createComponentFactory({
    component: ProjectNotesPage,
    imports: [ProjectNotesPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
