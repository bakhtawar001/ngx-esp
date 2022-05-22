import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import {
  FINANCIAL_DETAILS_LOCAL_STATE,
  FinancialDetailsLocalState,
} from '../../local-states';
import { AsiTaxPanelForm, AsiTaxPanelFormModule } from './tax-panel.form';

const selectors = {
  panelValue: dataCySelector('inactive'),
  taxCheckbox: dataCySelector('tax-checkbox'),
  taxCheckboxInput: '.cos-slide-toggle-input',
};

describe('AsiTaxPanelForm', () => {
  const createComponent = createComponentFactory({
    component: AsiTaxPanelForm,
    imports: [AsiTaxPanelFormModule],
  });

  const testSetup = (options?: { Tax?: boolean; IsEditable?: boolean }) => {
    const stateMock = {
      party: {
        Tax: options?.Tax,
        IsEditable:
          options?.IsEditable !== undefined ? options?.IsEditable : true,
      },
      partyIsReady: true,
    };
    const partyLocalStateMock = {
      connect: () => of(stateMock),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      save: () => {},
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

    const state = spectator.inject(FINANCIAL_DETAILS_LOCAL_STATE, true);

    spectator.detectComponentChanges();

    return { spectator, component: spectator.component, state };
  };

  it('should create', () => {
    const { component } = testSetup();

    expect(component).toBeTruthy();
  });

  describe('Read mode', () => {
    it('should display "Not Tax Exempt"', () => {
      const { spectator } = testSetup({ Tax: false });

      expect(spectator.query(selectors.panelValue)).toHaveText(
        'Not Tax Exempt'
      );
    });

    it('should display "Tax Exempt"', () => {
      const { spectator } = testSetup({ Tax: true });

      expect(spectator.query(selectors.panelValue)).toHaveText('Tax Exempt');
    });
  });

  describe('Edit mode', () => {
    it('should be not possible to enter edit mode when entity is not editable', () => {
      const { spectator } = testSetup({ IsEditable: false });

      expect(
        spectator
          .query(selectors.taxCheckbox)
          ?.getAttribute('ng-reflect-disabled')
      ).toBe('true');
    });

    it('should be possible to edit when entity is editable', () => {
      const { spectator } = testSetup({ IsEditable: true });

      expect(
        spectator
          .query(selectors.taxCheckbox)
          ?.getAttribute('ng-reflect-disabled')
      ).toBe('false');
    });

    it('should call save method after every change', () => {
      const { spectator, state } = testSetup({ IsEditable: true });
      jest.spyOn(state, 'save');

      spectator.dispatchFakeEvent(selectors.taxCheckboxInput, 'change', true);

      expect(state.save).toHaveBeenCalled();
    });
  });
});
