import { Address } from '@esp/models';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  AddressDisplayComponent,
  AddressDisplayComponentModule,
} from './address-display.component';

const address: Address = {
  City: 'city',
  Country: 'country',
  CountryType: 'type',
  Id: 1,
  IsPrimary: true,
  Line1: 'line 1',
  Line2: 'line 2',
  Name: 'name',
  PostalCode: 'postalcode',
  State: 'state',
};

describe('AddressDisplayComponent', () => {
  let component: AddressDisplayComponent;

  let spectator: SpectatorHost<AddressDisplayComponent>;

  const createHost = createHostFactory({
    component: AddressDisplayComponent,
    imports: [NgxsModule.forRoot([]), AddressDisplayComponentModule],
  });

  const testAddressProperty = (key: string, className: string) => {
    describe(key, () => {
      it('should display', () => {
        expect(className).toBeVisible();
      });

      it('should not display when data is not present', () => {
        component.address = { Id: 0 };

        spectator.detectComponentChanges();

        expect(className).not.toExist();
      });
    });
  };

  beforeEach(() => {
    spectator = createHost(
      `<esp-address-display [address]="address"><p>No Address</p></esp-address-display>`,
      { hostProps: { address } }
    );

    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Address', () => {
    testAddressProperty('Name', '.address-name');
    testAddressProperty('Line1', '.address-line1');
    testAddressProperty('Line2', '.address-line2');
    testAddressProperty('City', '.address-city');
    testAddressProperty('State', '.address-state');
    testAddressProperty('PostalCode', '.address-postalcode');
    testAddressProperty('Country', '.address-country');

    describe('State Separator', () => {
      it('should display when city and state are provided', () => {
        component.address = { Id: 0, City: 'city', State: 'state' };

        spectator.detectComponentChanges();

        expect(spectator.query('.address-city-separator')).toBeVisible();
      });

      it('should not display when city is provided and no state value', () => {
        component.address = { Id: 0, City: 'city', State: '' };

        spectator.detectComponentChanges();

        expect(spectator.query('.address-city-separator')).not.toExist();
      });

      it('should not display when state is provided and no city value', () => {
        component.address = { Id: 0, City: '', State: 'state' };

        spectator.detectComponentChanges();

        expect(spectator.query('.address-city-separator')).not.toExist();
      });
    });

    describe('Inline', () => {
      it('should have address-inline class when true', () => {
        component.address = { Id: 0, Name: 'name' };
        component.inline = true;

        spectator.detectComponentChanges();

        expect(spectator.query('address.address-inline')).toExist();
      });

      it('should not have address-inline class when not provided', () => {
        component.address = { Id: 0, Name: 'name' };

        spectator.detectComponentChanges();

        expect(spectator.query('address.address-inline')).not.toExist();
      });

      it('should not have address-inline class when false', () => {
        component.address = { Id: 0, Name: 'name' };
        component.inline = false;

        spectator.detectComponentChanges();

        expect(spectator.query('address.address-inline')).not.toExist();
      });
    });

    describe('Name', () => {
      it('should hide address name when showName value is false', () => {
        component.address = { Id: 0, Name: 'name' };
        component.showName = false;

        spectator.detectComponentChanges();

        expect(spectator.query('address.address-name')).not.toExist();
      });
    });

    describe('No Address', () => {
      it('should show No Address message if no address provided', () => {
        component.address = null;

        spectator.detectComponentChanges();

        expect(spectator.query('address')).toHaveText('No Address');
      });
    });
  });
});
