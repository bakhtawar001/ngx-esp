import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { UsersPage, UsersPageModule } from './users.page';

describe('UsersPage', () => {
  let spectator: Spectator<UsersPage>;
  let component: UsersPage;

  const createComponent = createComponentFactory({
    component: UsersPage,
    imports: [UsersPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
