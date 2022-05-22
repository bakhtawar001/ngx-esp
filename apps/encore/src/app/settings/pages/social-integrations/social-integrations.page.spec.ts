import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  SocialIntegrationsPage,
  SocialIntegrationsPageModule,
} from './social-integrations.page';

describe('SocialIntegrationsPage', () => {
  let spectator: Spectator<SocialIntegrationsPage>;
  let component: SocialIntegrationsPage;

  const createComponent = createComponentFactory({
    component: SocialIntegrationsPage,
    imports: [SocialIntegrationsPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
