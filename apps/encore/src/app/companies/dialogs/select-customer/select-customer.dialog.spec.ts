import { fakeAsync } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AsiCompanyAvatarComponent,
  AsiCompanyAvatarModule,
} from '@asi/company/ui/feature-components';
import {
  AsiDetailsCardLoaderComponent,
  AsiDetailsCardLoaderComponentModule,
  AsiUiDetailsCardComponent,
  AsiUiDetailsCardComponentModule,
} from '@asi/ui/details-card';
import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponents, MockProvider } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { CustomerSearchLocalState } from '../../../customers/local-states';
import {
  SelectCustomerDialog,
  SelectCustomerDialogModule,
} from './select-customer.dialog';

const MAX_ELEMENTS = CustomerSearchLocalState.maxCustomersCount;
const SORT_BY = CustomerSearchLocalState.sortCustomersBy;
const STATUS = CustomerSearchLocalState.status;

const buttons = {
  clearSearch: 'button.form-field-suffix',
  cancel: dataCySelector('cancel-button'),
};

const dialog = {
  header: dataCySelector('dialog-header'),
  subHeader: dataCySelector('dialog-sub-header'),
  search: dataCySelector('dialog-search'),
  newItemButton: dataCySelector('dialog-new-item-button'),
};

const createComponent = createComponentFactory({
  component: SelectCustomerDialog,
  imports: [
    SelectCustomerDialogModule,
    NgxsModule.forRoot(),
    RouterTestingModule,
  ],
  providers: [
    MockProvider(MatDialogRef, {
      afterOpened: () => EMPTY,
      backdropClick: () => EMPTY,
    }),
  ],
  overrideModules: [
    [
      AsiUiDetailsCardComponentModule,
      {
        set: {
          declarations: MockComponents(AsiUiDetailsCardComponent),
          exports: MockComponents(AsiUiDetailsCardComponent),
        },
      },
    ],
    [
      AsiCompanyAvatarModule,
      {
        set: {
          declarations: MockComponents(AsiCompanyAvatarComponent),
          exports: MockComponents(AsiCompanyAvatarComponent),
        },
      },
    ],
    [
      AsiDetailsCardLoaderComponentModule,
      {
        set: {
          declarations: MockComponents(AsiDetailsCardLoaderComponent),
          exports: MockComponents(AsiDetailsCardLoaderComponent),
        },
      },
    ],
  ],
});

const testSetup = () => {
  const spectator = createComponent({
    providers: [
      MockProvider(CustomerSearchLocalState, {
        connect: () => EMPTY,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        search: () => {},
      }),
    ],
  });

  return {
    spectator,
    component: spectator.component,
    state: spectator.inject(CustomerSearchLocalState, true),
  };
};

describe('SelectCustomerDialog', () => {
  it('should create', () => {
    // Arrange
    const { spectator } = testSetup();

    // Assert
    expect(spectator).toBeTruthy();
  });

  describe('Cancel button', () => {
    it("should show 'Back' button correctly", () => {
      // Arrange
      const { spectator } = testSetup();
      const backButton = spectator.query(buttons.cancel);
      const backButtonIcon = backButton.querySelector('i');

      // Assert
      expect(backButton).toBeVisible();
      expect(backButton).toHaveDescendant(backButtonIcon);
      expect(backButton).toHaveText('Back');
      expect(backButtonIcon).toHaveClass('fa fa-arrow-left mr-8');
    });

    it('should not be disabled', () => {
      // Arrange
      const { spectator } = testSetup();

      // Assert
      expect(spectator.query(buttons.cancel)).not.toHaveAttribute('disabled');
    });
  });

  describe('Dialog header', () => {
    it('should contain a title', () => {
      // Arrange
      const { spectator } = testSetup();

      // Assert
      expect(spectator.query(dialog.header)).toBeTruthy();
    });

    it('title should be capitalized', () => {
      // Arrange
      const { spectator } = testSetup();

      // Assert
      expect(spectator.query(dialog.header).textContent.trim()).toEqual(
        'Create a new Customer or Select a Customer'
      );
    });

    it('should contain sub-title', () => {
      // Arrange
      const { spectator } = testSetup();

      // Assert
      expect(spectator.query(dialog.subHeader)).toBeTruthy();
    });

    it('sub-title should contain a valid text', () => {
      // Arrange
      const { spectator } = testSetup();

      // Assert
      expect(spectator.query(dialog.subHeader).textContent.trim()).toEqual(
        'Projects requires a customer to be selected. You can choose to create a new customer or select an existing customer.'
      );
    });
  });

  describe('Create new Customer card', () => {
    it('should contain a valid text', () => {
      // Arrange
      const { spectator } = testSetup();

      // Assert
      expect(spectator.query(dialog.newItemButton).textContent.trim()).toEqual(
        'Create a New Customer'
      );
    });
  });

  describe('Search', () => {
    it('should display search with a valid placeholder', () => {
      // Arrange
      const { spectator } = testSetup();
      const input = spectator.query(dialog.search);

      // Assert
      expect(input.getAttribute('placeholder')).toEqual(
        'Search for a Customer'
      );
    });

    it('should trigger search after typing a data', fakeAsync(() => {
      // Arrange
      const { spectator, state } = testSetup();
      const input = spectator.query(dialog.search);
      jest.spyOn(state, 'search');
      const searchTerm = 'test';

      // Act
      spectator.typeInElement(searchTerm, input);
      spectator.tick(250);

      // Assert
      expect(state.search).toHaveBeenCalledWith({
        term: searchTerm,
        size: MAX_ELEMENTS,
        sortBy: SORT_BY,
        status: STATUS,
      });
    }));

    it('should load max. 11 customers', fakeAsync(() => {
      // Arrange
      const { spectator, state } = testSetup();
      const input = spectator.query(dialog.search);
      jest.spyOn(state, 'search');

      // Act
      spectator.typeInElement('', input);
      spectator.tick(250);

      // Assert
      expect(state.search).toHaveBeenCalledWith({
        term: '',
        size: MAX_ELEMENTS,
        sortBy: SORT_BY,
        status: STATUS,
      });
    }));

    it('should sort customers by last activity date', fakeAsync(() => {
      // Arrange
      const { spectator, state } = testSetup();
      const input = spectator.query(dialog.search);
      jest.spyOn(state, 'search');

      // Act
      spectator.typeInElement('', input);
      spectator.tick(250);

      // Assert
      expect(state.search).toHaveBeenCalledWith({
        term: '',
        size: MAX_ELEMENTS,
        sortBy: SORT_BY,
        status: STATUS,
      });
    }));

    it("should display the 'X' button to clear search field when data is entered", () => {
      // Arrange
      const { spectator } = testSetup();
      const input = spectator.query(dialog.search);

      // Act
      spectator.typeInElement('test', input);
      spectator.detectComponentChanges();
      const closeButton = spectator.query(buttons.clearSearch);
      const closeButtonIcon = closeButton.querySelector('i');

      // Assert
      expect(closeButton).toBeVisible();
      expect(closeButton).toHaveDescendant(closeButtonIcon);
      expect(closeButtonIcon).toHaveClass('fa fa-times');
    });

    it('clicking on X icon should clear the search', fakeAsync(() => {
      // Arrange
      const { spectator, state } = testSetup();
      const input = spectator.query(dialog.search);
      jest.spyOn(state, 'search');

      // Act
      spectator.typeInElement('test', input);
      spectator.tick(100);
      spectator.click(buttons.clearSearch);
      spectator.tick(250);

      // Assert
      expect(state.search).toHaveBeenCalledWith({
        term: '',
        size: MAX_ELEMENTS,
        sortBy: SORT_BY,
        status: STATUS,
      });
    }));
  });
});
