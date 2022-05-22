import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TeamsPage, TeamsPageModule } from './teams.page';

describe('TeamsPage', () => {
  let spectator: Spectator<TeamsPage>;
  let component: TeamsPage;

  const createComponent = createComponentFactory({
    component: TeamsPage,
    imports: [TeamsPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
