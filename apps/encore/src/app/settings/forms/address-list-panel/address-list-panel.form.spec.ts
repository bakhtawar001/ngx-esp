import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import {
  CosAddressFormComponent,
  CosAddressFormModule,
} from '@cosmos/components/address-form';
import { dataCySelector } from '@cosmos/testing';
import { EspContactsModule } from '@esp/contacts';
import { Address } from '@esp/models';
import { PARTY_LOCAL_STATE, PartyLocalState } from '@esp/parties';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import {
  AddressListPanelForm,
  AddressListPanelFormModule,
} from './address-list-panel.form';

const mockAddress = {
  Id: 1,
  Name: 'Test Address',
  Line1: '3333 Broadway 33rd st.',
  Line2: '',
  IsPrimary: true,
  Type: 'GNRL',
};

const selectors = {
  addAddressButton: '[data-cy=add-address-button]',
  addressForm: dataCySelector('address-form'),
  makeAsPrimaryCheckbox: dataCySelector('make-as-primary-address'),
  makeAsBillingCheckbox: dataCySelector('make-as-billing-address'),
  pinIcon: dataCySelector('pin-icon'),
  editButton: dataCySelector('action-button'),
  removeAddressButton: dataCySelector('remove-address-button'),
};

describe('AddressListPanelForm', () => {
  const createComponent = createComponentFactory({
    component: AddressListPanelForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      EspContactsModule,
      AddressListPanelFormModule,
    ],
    providers: [mockProvider(MatDialog)],
    overrideModules: [
      [
        CosAddressFormModule,
        {
          set: {
            declarations: MockComponents(CosAddressFormComponent),
            exports: MockComponents(CosAddressFormComponent),
          },
        },
      ],
    ],
  });

  const testSetup = (options?: {
    addresses?: Partial<Address>[];
    isEditable?: boolean;
  }) => {
    const partyMock = {
      Addresses: options?.addresses ?? [],
      IsEditable: options?.isEditable !== undefined ? options.isEditable : true,
    };
    const localStateMock = {
      connect: () =>
        of({
          party: partyMock,
        }),
      party: partyMock,
      partyIsReady: true,
    };

    const spectator = createComponent({
      providers: [
        {
          provide: PARTY_LOCAL_STATE,
          useValue: localStateMock,
        },
        {
          provide: PartyLocalState,
          useValue: localStateMock,
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

  it('should display addresses section', () => {
    const { spectator } = testSetup();
    const heading = spectator.query('cos-segmented-panel-header > h2');
    expect(heading.textContent).toMatch('Addresses');
  });

  it('should display "Primary Address" & "No addresses" text with Add button on right when no addresses are available', () => {
    const { spectator } = testSetup();
    const addressDisplay = spectator.query('[data-cy=address-display]');
    const header = spectator.query('cos-segmented-panel-header');
    expect(
      addressDisplay.querySelector('.form-row-title').textContent.trim()
    ).toEqual('Primary address');
    expect(
      addressDisplay.querySelector('.form-row-value').textContent.trim()
    ).toEqual('No address provided');
    expect(
      header.querySelector('button[cos-flat-button]').textContent.trim()
    ).toEqual('Add Address');
  });

  it('should show pin icon', () => {
    const { spectator } = testSetup();

    expect(spectator.query(selectors.pinIcon)).toBeVisible();
  });

  it('should display edit button when no address available', () => {
    const { spectator } = testSetup();

    expect(spectator.query(selectors.editButton)).toBeVisible();
    expect(spectator.query(selectors.editButton).textContent.trim()).toEqual(
      'Edit'
    );
  });

  describe('Add address', () => {
    it('should not be visible if party is not editable', () => {
      const { spectator } = testSetup({ isEditable: false });

      expect(spectator.query(selectors.editButton)).toBeFalsy();
    });

    it('should append new address form row at the bottom', () => {
      const { spectator } = testSetup();

      clickAddAddressButton(spectator);

      expect(spectator.query(selectors.addressForm)).toBeVisible();
    });

    it('should show "Make Primary" checkbox', () => {
      const { spectator } = testSetup();

      clickAddAddressButton(spectator);

      expect(spectator.query(selectors.makeAsPrimaryCheckbox)).toBeVisible();
      expect(
        spectator.query(selectors.makeAsPrimaryCheckbox).textContent.trim()
      ).toEqual('Make Primary');
    });

    it('should show "Make Billing" checkbox', () => {
      const { spectator } = testSetup();

      clickAddAddressButton(spectator);

      expect(spectator.query(selectors.makeAsBillingCheckbox)).toBeTruthy();
      expect(
        spectator.query(selectors.makeAsBillingCheckbox).textContent.trim()
      ).toEqual('Make Billing');
    });

    it('should not show remove address button', () => {
      const { spectator } = testSetup();

      clickAddAddressButton(spectator);

      expect(spectator.query(selectors.removeAddressButton)).not.toBeVisible();
    });
  });

  describe('Edit address', () => {
    it('should show "Edit" button', () => {
      const { spectator } = testSetup({ addresses: [mockAddress] });

      expect(spectator.query(selectors.editButton)).toBeVisible();
    });

    it('should not be visible if party is not editable', () => {
      const { spectator } = testSetup({ isEditable: false });

      expect(spectator.query(selectors.editButton)).toBeFalsy();
    });

    it('should show address details ready to edit on clicking "Edit" Button', () => {
      const { spectator } = testSetup({ addresses: [mockAddress] });

      spectator.click(selectors.editButton);

      expect(spectator.query(selectors.addressForm)).toBeVisible();
    });

    it('should show remove address button', () => {
      const { spectator } = testSetup({ addresses: [mockAddress] });

      spectator.click(selectors.editButton);

      expect(spectator.query(selectors.removeAddressButton)).toBeVisible();
      expect(
        spectator.query(selectors.removeAddressButton).textContent.trim()
      ).toEqual('Remove');
    });
  });
});

function clickAddAddressButton(
  spectator: Spectator<AddressListPanelForm>
): void {
  spectator.click(selectors.addAddressButton);
}
