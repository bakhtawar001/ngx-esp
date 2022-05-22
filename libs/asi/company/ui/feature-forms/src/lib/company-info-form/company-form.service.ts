import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { ValidateEmail, ValidateUrl, ValidateWhitespace } from '@cosmos/common';
import { FormBuilder, FormControl, FormGroup } from '@cosmos/forms';
import {
  Address,
  BrandInformation,
  Company,
  Email,
  Phone,
  PhoneTypeEnum,
  Website,
  WebsiteTypeEnum,
} from '@esp/models';
import {
  CompanyFormModel,
  CompanyInfoFormModel,
} from '@asi/company/ui/feature-core';
import { DEFAULT_COLOR } from '@esp/settings';

@Injectable({
  providedIn: 'root',
})
export class AsiCompanyFormService {
  static readonly validation = {
    name: {
      maxLength: 50,
    },
    givenName: {
      maxLength: 50,
    },
    familyName: {
      maxLength: 50,
    },
    primaryEmail: {
      maxLength: 100,
    },
  };

  constructor(private _fb: FormBuilder) {}

  public mapFormToCompanyData(data: CompanyFormModel): Partial<Company> {
    const companyData = {
      ...data.CompanyInformation,
      ...data.BrandInformation,
      Addresses: data.CompanyInformation.Address
        ? [data.CompanyInformation.Address]
        : [],
      Phones: data.CompanyInformation.Phone
        ? [data.CompanyInformation.Phone]
        : [],
      Emails: data.CompanyInformation.PrimaryEmail
        ? [data.CompanyInformation.PrimaryEmail]
        : [],
      Websites: data.BrandInformation.Website?.Url
        ? [data.BrandInformation.Website]
        : [],
    };

    delete companyData.Address;
    delete companyData.Phone;
    delete companyData.PrimaryEmail;
    delete companyData.Website;

    return companyData;
  }

  public getCompanyFormGroup(
    infoData?: CompanyInfoFormModel,
    companyType?: string,
    brandInfo?: BrandInformation
  ): FormGroup<CompanyFormModel> {
    return this._fb.group({
      CompanyInformation: this.getInfoFormGroup(infoData, companyType),
      BrandInformation: this.getBrandInformationFormGroup(brandInfo),
    });
  }

  private getInfoFormGroup(
    data?: CompanyInfoFormModel,
    companyType?: string
  ): FormGroup<CompanyInfoFormModel> {
    return this._fb.group(
      {
        Name: new FormControl(data?.Name ?? '', {
          validators: [
            Validators.required,
            Validators.maxLength(
              AsiCompanyFormService.validation.name.maxLength
            ),
            ValidateWhitespace,
          ],
          updateOn: 'blur',
        }),
        GivenName: new FormControl(data?.GivenName ?? '', [
          Validators.required,
          Validators.maxLength(
            AsiCompanyFormService.validation.givenName.maxLength
          ),
          ValidateWhitespace,
        ]),
        FamilyName: new FormControl(data?.FamilyName ?? '', [
          Validators.required,
          Validators.maxLength(
            AsiCompanyFormService.validation.familyName.maxLength
          ),
          ValidateWhitespace,
        ]),
        IsCustomer: new FormControl(companyType === 'Customer'),
        IsDecorator: new FormControl(companyType === 'Decorator'),
        IsSupplier: new FormControl(companyType === 'Supplier'),
        PrimaryEmail: this.newEmailGroup(data?.PrimaryEmail),
        Address: this.getAddressGroup(data?.Address),
        Phone: this.newPhoneGroup(data?.Phone),
        IsAcknowledgementContact: new FormControl(
          data?.IsAcknowledgementContact || false
        ),
        IsBillingContact: new FormControl(data?.IsBillingContact || false),
        IsShippingContact: new FormControl(data?.IsShippingContact || false),
      },
      {
        validator: this.requiredTypeValidator(),
      }
    );
  }

  private getBrandInformationFormGroup(
    data?: BrandInformation
  ): FormGroup<BrandInformation> {
    return this._fb.group({
      Website: this.newWebsiteGroup(data?.Website),
      PrimaryBrandColor: [data?.PrimaryBrandColor || DEFAULT_COLOR],
      LogoMediaLink: [data?.LogoMediaLink || null],
      IconMediaLink: [data?.IconMediaLink || null],
    });
  }

  private newEmailGroup(email?: Email): FormGroup<Email> {
    return this._fb.group({
      Id: [0],
      IsPrimary: [true],
      Type: ['Work'],
      Address: [email?.Address || '', ValidateEmail],
    });
  }

  private newPhoneGroup(phone?: Phone): FormGroup<Phone> {
    return this._fb.group({
      Country: ['USA'],
      Id: [0],
      IsPrimary: [false],
      Number: [phone?.Number || ''],
      PhoneCode: ['1'],
      Type: [phone?.Type || PhoneTypeEnum.Office],
    });
  }

  private newWebsiteGroup(website?: Website): FormGroup<Website> {
    return this._fb.group({
      Id: [0],
      IsPrimary: [true],
      Type: [WebsiteTypeEnum.Corporate],
      Url: [website?.Url || '', ValidateUrl],
    });
  }

  private getAddressGroup(address?: Address): FormGroup<Address> {
    return this._fb.group({
      Line1: [address?.Line1 || ''],
      Line2: [address?.Line2 || ''],
      City: [address?.City || ''],
      State: [address?.State || ''],
      PostalCode: [address?.PostalCode || ''],
      CountryType: [address?.CountryType || ''],
    });
  }

  private requiredTypeValidator() {
    return function validate(formGroup: FormGroup) {
      const minRequired = 1;
      let checked = 0;

      Object.keys(formGroup.controls).forEach((key) => {
        if (key.indexOf('Is') > -1) {
          const control = formGroup.controls[key];

          if (control.value === true) {
            checked++;
          }
        }
      });

      if (checked < minRequired) {
        return {
          requireCheckboxesToBeChecked: true,
        };
      }

      return null;
    };
  }
}
