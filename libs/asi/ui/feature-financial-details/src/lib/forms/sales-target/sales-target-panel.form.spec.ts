import { dataCySelector } from '@cosmos/testing';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import {
  FINANCIAL_DETAILS_LOCAL_STATE,
  FinancialDetailsLocalState,
} from '../../local-states';
import {
  AsiSalesTargetPanelForm,
  AsiSalesTargetPanelFormModule,
} from './sales-target-panel.form';

const selectors = {
  inactive: dataCySelector('inactive'),
  toggleEditButton: dataCySelector('action-button'),
  cancelButton: dataCySelector('cancel-button'),
  submitButton: dataCySelector('save-button'),
  salesTargetInput: dataCySelector('sales-target-input'),
};

describe('AsiSalesTargetPanelForm', () => {
  const createComponent = createComponentFactory({
    component: AsiSalesTargetPanelForm,
    imports: [AsiSalesTargetPanelFormModule],
  });

  const testSetup = (options?: {
    SalesTarget?: string;
    IsEditable?: boolean;
  }) => {
    const stateMock = {
      party: {
        SalesTarget: options?.SalesTarget,
        IsEditable:
          options?.IsEditable !== undefined ? options?.IsEditable : true,
      },
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

  describe('Read mode', () => {
    it('should display $ 0 if no sales target is set', () => {
      const { spectator } = testSetup({ SalesTarget: undefined });

      expect(spectator.query(selectors.inactive)).toHaveText('$ 0');
    });

    it('should display valid value when sales target is set', () => {
      const { spectator } = testSetup({ SalesTarget: '100' });

      expect(spectator.query(selectors.inactive)).toHaveText('$ 100');
    });
  });

  describe('Edit mode', () => {
    it('should be not possible to enter edit mode when entity is not editable', () => {
      const { spectator } = testSetup({ IsEditable: false });

      expect(spectator.query(selectors.toggleEditButton)).not.toBeVisible();
    });

    it('should show cancel, submit buttons and inline edit input', () => {
      const { spectator } = testSetup();
      toggleEditMode(spectator);

      expect(spectator.query(selectors.cancelButton)).toBeVisible();
      expect(spectator.query(selectors.submitButton)).toBeVisible();
      expect(spectator.query(selectors.salesTargetInput)).toBeVisible();
    });

    it('should have maxlength set', () => {
      const { spectator } = testSetup();
      toggleEditMode(spectator);

      expect(
        spectator.query(selectors.salesTargetInput)?.getAttribute('maxlength')
      ).toEqual('13');
    });

    it('cancel button should be enabled', () => {
      const { spectator } = testSetup();
      toggleEditMode(spectator);

      expect(
        spectator.query(selectors.cancelButton)?.getAttribute('disabled')
      ).toBe(null);
    });

    it('submit button should be disabled when no change is done', () => {
      const { spectator } = testSetup();
      toggleEditMode(spectator);

      expect(
        spectator.query(selectors.submitButton)?.getAttribute('disabled')
      ).toBe('true');
    });

    it('submit button should be enabled when any change is done', () => {
      const { spectator } = testSetup();
      toggleEditMode(spectator);

      spectator.typeInElement('105', selectors.salesTargetInput);

      expect(
        spectator.query(selectors.submitButton)?.getAttribute('disabled')
      ).toBe(null);
    });
  });
});

function toggleEditMode(spectator: Spectator<AsiSalesTargetPanelForm>): void {
  spectator.click(selectors.toggleEditButton);
}
