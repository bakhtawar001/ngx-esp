import { createComponentFactory } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import '__mocks__/googlePlacesMock';
import { CosAddressFormComponent } from './address-form.component';
import { CosAddressFormModule } from './address-form.module';

describe('AddressFormComponent', () => {
  const createComponent = createComponentFactory({
    component: CosAddressFormComponent,
    imports: [NgxsModule.forRoot(), CosAddressFormModule],
  });

  const testSetup = () => {
    const spectator = createComponent();
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    // Arrange
    const { spectator } = testSetup();

    // Assert
    expect(spectator).toBeTruthy();
  });

  it('should confirm that the address name field is required for the primary address', () => {
    // Arrange
    const { spectator } = testSetup();
    const addressNameInput =
      spectator.queryAll('.cos-form-row')[0].children[1].children[0];

    // Assert
    expect(addressNameInput).toExist();
    expect(addressNameInput).toHaveAttribute('required');
  });

  it('should have watermark "Enter or Choose Address" on Address Line 1 field', () => {
    // Arrange
    const { spectator } = testSetup();
    const address1 = spectator.query('#line1');
    const placeholder = address1.getAttribute('placeholder');

    // Assert
    expect(placeholder).toMatch('Enter or Choose Address');
  });

  it('should have watermark "Apt, suite, department, building, floor, etc." on Address Line 2 field', () => {
    // Arrange
    const { spectator } = testSetup();
    const address1 = spectator.query('#line2');
    const placeholder = address1.getAttribute('placeholder');

    // Assert
    expect(placeholder).toMatch(
      'Apt, suite, department, building, floor, etc.'
    );
  });

  xit('should not check validations when no validations input is provided', () => {
    // Arrange
    const { component, spectator } = testSetup();
    const saveButton = spectator.query('#cos-address-submit-btn');
    const form = component.form;

    // Act
    spectator.click(saveButton);
    spectator.detectChanges();

    // Assert
    expect(form.valid).toBeTruthy();
  });

  describe('Validations', () => {
    it('should check that Name input has max characters equal to 100', () => {
      // Arrange
      const { spectator } = testSetup();
      const nameInput = spectator.query('#name');
      const maxLengthNameInput = nameInput.getAttribute('maxlength');

      // Assert
      expect(maxLengthNameInput).toEqual('100');
    });

    it('should check that Address1 / Address2 input has max characters equal to 128', () => {
      // Arrange
      const { spectator } = testSetup();
      const address1 = spectator.query('#line1');
      const address2 = spectator.query('#line2');
      const maxLengthAddress1 = address1.getAttribute('maxlength');
      const maxLengthAddress2 = address2.getAttribute('maxlength');

      // Assert
      expect(maxLengthAddress1).toEqual('128');
      expect(maxLengthAddress2).toEqual('128');
    });

    it('should check that State/Province input has max characters equal to 40', () => {
      // Arrange
      const { spectator } = testSetup();
      const stateInput = spectator.query('#state');
      const maxLengthStateInput = stateInput.getAttribute('maxlength');

      // Assert
      expect(maxLengthStateInput).toEqual('40');
    });

    it('should check that City input has max characters equal to 35', () => {
      // Arrange
      const { spectator } = testSetup();
      const cityInput = spectator.query('#city');
      const maxLengthCityInput = cityInput.getAttribute('maxlength');

      // Assert
      expect(maxLengthCityInput).toEqual('35');
    });

    it('should check that Zip Code input has max characters equal to 15', () => {
      // Arrange
      const { spectator } = testSetup();
      const zipCodeInput = spectator.query('#zipCode');
      const maxLengthZipCodeInput = zipCodeInput.getAttribute('maxlength');

      // Assert
      expect(maxLengthZipCodeInput).toEqual('15');
    });

    it('should check that Country input has max characters equal to 40', () => {
      // Arrange
      const { spectator } = testSetup();
      const countryInput = spectator.query('#country');
      const maxLengthCountryInput = countryInput.getAttribute('maxlength');

      // Assert
      expect(maxLengthCountryInput).toEqual('40');
    });
  });
});
