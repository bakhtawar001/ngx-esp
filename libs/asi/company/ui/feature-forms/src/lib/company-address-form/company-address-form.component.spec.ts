import { FormGroup } from '@angular/forms';
import {
  CosAddressFormComponent,
  CosAddressFormModule,
} from '@cosmos/components/address-form';
import { FormControl } from '@cosmos/forms';
import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import '../../../../../../../__mocks__/googlePlacesMock.js';
import { MockComponent } from 'ng-mocks';
import {
  AsiCompanyAddressFormComponentModule,
  AsiCompanyAddressFormComponent,
} from './company-address-form.component';

const address = {
  form: dataCySelector('address-form'),
};

describe('AsiCompanyAddressFormComponent', () => {
  const createComponent = createComponentFactory({
    component: AsiCompanyAddressFormComponent,
    imports: [AsiCompanyAddressFormComponentModule, NgxsModule.forRoot()],
    overrideModules: [
      [
        CosAddressFormModule,
        {
          set: {
            declarations: [MockComponent(CosAddressFormComponent)],
            exports: [MockComponent(CosAddressFormComponent)],
          },
        },
      ],
    ],
  });

  const testSetup = () => {
    const spectator = createComponent();
    const component = spectator.component;

    component.form = new FormGroup({
      Line1: new FormControl(''),
      Line2: new FormControl(''),
      City: new FormControl(''),
      CountryType: new FormControl(''),
      State: new FormControl(''),
    });

    spectator.detectChanges();

    return { spectator, component };
  };

  it('should create', () => {
    //Arrange
    const { spectator, component } = testSetup();

    //Assert
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should show address form', () => {
    //Arrange
    const { spectator, component } = testSetup();
    const shippingAddressForm = spectator.query(address.form);

    //Assert
    expect(shippingAddressForm).toBeVisible();
    expect(component.form).toBeDefined();
  });
});
