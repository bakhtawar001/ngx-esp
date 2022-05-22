import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AuthPage, AuthPageModule } from './auth.page';

describe('AuthPage', () => {
  let spectator: Spectator<AuthPage>;
  let component: AuthPage;

  const createComponent = createComponentFactory({
    component: AuthPage,
    imports: [RouterTestingModule, AuthPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
