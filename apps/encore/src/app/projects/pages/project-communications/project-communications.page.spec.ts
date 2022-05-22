import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  ProjectCommunicationsPage,
  ProjectCommunicationsPageModule,
} from './project-communications.page';

describe('ProjectCommunicationsPage', () => {
  let spectator: Spectator<ProjectCommunicationsPage>;
  let component: ProjectCommunicationsPage;

  const createComponent = createComponentFactory({
    component: ProjectCommunicationsPage,
    imports: [ProjectCommunicationsPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
