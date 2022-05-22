import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import {
  FINANCIAL_DETAILS_LOCAL_STATE,
  FinancialDetailsLocalState,
} from '../../local-states';
import {
  AsiCurrencyPanelForm,
  AsiCurrencyPanelFormModule,
} from './currency-panel.form';

describe('AsiCurrencyPanelForm', () => {
  const createComponent = createComponentFactory({
    component: AsiCurrencyPanelForm,
    imports: [AsiCurrencyPanelFormModule],
  });

  const testSetup = (options?: { IsEditable?: boolean }) => {
    const stateMock = {
      party: {
        IsEditable:
          options?.IsEditable !== undefined ? options?.IsEditable : true,
      },
      partyLookups: { CreditTerms: [] },
      partyIsReady: true,
    };
    const partyLocalStateMock = {
      connect: () => of(stateMock),
      ...stateMock,
    };

    const spectator = createComponent({
      providers: [
        mockProvider(FinancialDetailsLocalState, partyLocalStateMock),
        {
          provide: FINANCIAL_DETAILS_LOCAL_STATE,
          useValue: partyLocalStateMock,
        },
      ],
    });

    spectator.detectComponentChanges();

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();

    expect(component).toBeTruthy();
  });
});
