import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  AccountingIntegrationsPage,
  AccountingIntegrationsPageModule,
} from './accounting-integrations.page';

describe('AccountingIntegrationsPage', () => {
  let spectator: Spectator<AccountingIntegrationsPage>;
  let component: AccountingIntegrationsPage;

  const createComponent = createComponentFactory({
    component: AccountingIntegrationsPage,
    imports: [AccountingIntegrationsPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
