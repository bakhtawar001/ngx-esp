import { ChangeDetectorRef } from '@angular/core';
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
  AsiCreditTermsPanelForm,
  AsiCreditTermsPanelFormModule,
} from './credit-terms-panel.form';

const selectors = {
  toggleEditButton: dataCySelector('action-button'),
  cancelButton: dataCySelector('cancel-button'),
  submitButton: dataCySelector('save-button'),
  inactive: dataCySelector('inactive'),
  defaultTermsAutocomplete: dataCySelector('credit-terms-autocomplete'),
  autocompleteOption: dataCySelector('autocomplete-option'),
};

describe('AsiCreditTermsPanelForm', () => {
  const createComponent = createComponentFactory({
    component: AsiCreditTermsPanelForm,
    imports: [AsiCreditTermsPanelFormModule],
  });

  const testSetup = (options?: {
    CreditTerms?: string[];
    IsEditable?: boolean;
  }) => {
    const stateMock = {
      party: {
        CreditTerms: options?.CreditTerms,
        IsEditable:
          options?.IsEditable !== undefined ? options?.IsEditable : true,
      },
      partyLookups: { CreditTerms: options?.CreditTerms ?? ['Cash', 'C.O.D.'] },
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
    it('should display "-" if no value is set', () => {
      const { spectator } = testSetup({ CreditTerms: [] });

      expect(spectator.query(selectors.inactive)).toHaveText('-');
    });

    it('should display "-" if empty value is set', () => {
      const { spectator } = testSetup({ CreditTerms: [' '] });

      expect(spectator.query(selectors.inactive)).toHaveText('-');
    });

    it('should display valid value when value is set', () => {
      const { spectator } = testSetup({ CreditTerms: ['Cash'] });

      expect(spectator.query(selectors.inactive)).toHaveText('Cash');
    });
  });

  describe('Edit mode', () => {
    it('should be not possible to enter edit mode when entity is not editable', () => {
      const { spectator } = testSetup({ IsEditable: false });

      expect(spectator.query(selectors.toggleEditButton)).not.toBeVisible();
    });

    it('should show cancel, submit buttons and autocomplete', () => {
      const { spectator } = testSetup();
      toggleEditMode(spectator);

      expect(spectator.query(selectors.cancelButton)).toBeVisible();
      expect(spectator.query(selectors.submitButton)).toBeVisible();
      expect(spectator.query(selectors.defaultTermsAutocomplete)).toBeVisible();
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
      const { spectator, component } = testSetup();
      toggleEditMode(spectator);

      component.form.controls.CreditTerms?.setValue('Cash');
      spectator.detectComponentChanges();

      expect(
        spectator.query(selectors.submitButton)?.getAttribute('disabled')
      ).toBe(null);
    });
  });
});

function toggleEditMode(spectator: Spectator<AsiCreditTermsPanelForm>): void {
  spectator.click(selectors.toggleEditButton);
}
