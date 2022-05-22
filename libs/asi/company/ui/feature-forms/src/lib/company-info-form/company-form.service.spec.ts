import { createServiceFactory } from '@ngneat/spectator/jest';

import { FormBuilder } from '@cosmos/forms';

import { AsiCompanyFormService } from './company-form.service';

describe('CompanyFormService', () => {
  const createService = createServiceFactory({
    service: AsiCompanyFormService,
    providers: [FormBuilder],
  });

  const testSetup = () => {
    const spectator = createService();
    return { spectator, service: spectator.service };
  };

  it('should create', () => {
    expect(true).toBeTruthy();
    //Arrange
    const { spectator, service } = testSetup();

    //Assert
    expect(spectator).toBeTruthy();
    expect(service).toBeTruthy();
  });

  describe('info form', () => {
    describe('Name field validation', () => {
      it('should be required', () => {
        //Arrange
        const { service } = testSetup();

        //Act
        const form = service.getCompanyFormGroup();
        const name = form.get('CompanyInformation.Name');
        const errors = name.errors || {};
        expect(errors['required']).toBeTruthy();

        //Assert
        expect(name.valid).toBeFalsy();
      });

      it('should be valid', () => {
        //Arrange
        const { service } = testSetup();

        //Act
        const form = service.getCompanyFormGroup();
        const name = form.get('CompanyInformation.Name');
        name.setValue('test');

        //Assert
        expect(name.valid).toBeTruthy();
      });

      it('should be invalid when only whitespaces', () => {
        //Arrange
        const { service } = testSetup();

        //Act
        const form = service.getCompanyFormGroup();
        const name = form.get('CompanyInformation.Name');
        name.setValue('       ');

        //Assert
        expect(name.valid).toBeFalsy();
      });
    });

    describe('IsCustomer controls', () => {
      it('should  be true', () => {
        //Arrange
        const { service } = testSetup();

        //Act
        const form = service.getCompanyFormGroup(null, 'Customer');

        //Assert
        expect(form.get('CompanyInformation.IsCustomer')).toBeTruthy();
      });

      it('should  change to true', () => {
        //Arrange
        const { service } = testSetup();

        //Act
        const form = service.getCompanyFormGroup(null);

        //Assert
        expect(form.get('CompanyInformation.IsCustomer')).toBeTruthy();
      });
    });

    describe('IsDecorator controls', () => {
      it('should  be true', () => {
        //Arrange
        const { service } = testSetup();

        //Act
        const form = service.getCompanyFormGroup(null, 'Customer');

        //Assert
        expect(form.get('CompanyInformation.IsCustomer')).toBeTruthy();
      });

      it('should change to true', () => {
        const { service } = testSetup();

        //Act
        const form = service.getCompanyFormGroup();
        form.get('CompanyInformation.IsCustomer').setValue(true);

        //Assert
        expect(form.get('CompanyInformation.IsCustomer')).toBeTruthy();
      });
    });

    describe('IsSupplier controls', () => {
      it('should  be true', () => {
        //Arrange
        const { service } = testSetup();

        //Act
        const form = service.getCompanyFormGroup(null, 'Supplier');

        //Assert
        expect(form.get('CompanyInformation.IsSupplier')).toBeTruthy();
      });

      it('should  change to true', () => {
        const { service } = testSetup();

        //Act
        const form = service.getCompanyFormGroup();
        form.get('CompanyInformation.IsSupplier').setValue(true);

        //Assert
        expect(form.get('CompanyInformation.IsSupplier')).toBeTruthy();
      });
    });

    it('should valid', () => {
      //Arrange
      const { service } = testSetup();

      //Act
      const form = service.getCompanyFormGroup(null, 'Customer');
      form?.get('CompanyInformation.Name').setValue('test');
      form?.get('CompanyInformation.GivenName').setValue('test');
      form?.get('CompanyInformation.FamilyName').setValue('test');

      //Assert
      expect(form.valid).toBeTruthy();
    });
  });
});
