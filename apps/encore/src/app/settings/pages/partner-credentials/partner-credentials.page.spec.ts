import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  PartnerCredentialsPage,
  PartnerCredentialsPageModule,
} from './partner-credentials.page';

describe('PartnerCredentialsPage', () => {
  let spectator: Spectator<PartnerCredentialsPage>;
  let component: PartnerCredentialsPage;

  const createComponent = createComponentFactory({
    component: PartnerCredentialsPage,
    imports: [PartnerCredentialsPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
