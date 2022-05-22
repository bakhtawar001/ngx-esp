import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  ProjectOrdersPage,
  ProjectOrdersPageModule,
} from './project-orders.page';

describe('ProjectOrdersPage', () => {
  let spectator: Spectator<ProjectOrdersPage>;
  let component: ProjectOrdersPage;

  const createComponent = createComponentFactory({
    component: ProjectOrdersPage,
    imports: [ProjectOrdersPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
