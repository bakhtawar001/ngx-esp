import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { ValidateEmail, ValidateUrl } from '@cosmos/common';
import { FormBuilder, FormControl, FormGroup } from '@cosmos/forms';
import {
  Address,
  BrandInformation,
  Email,
  Phone,
  PhoneTypeEnum,
  Website,
  WebsiteTypeEnum,
} from '@esp/models';
import { CompanyInfoFormModel } from '@asi/company/ui/feature-core';
import { DEFAULT_COLOR } from '@esp/settings';

@Injectable()
export class AsiProjectCreateCustomerFormPresenter {
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

  readonly customFormErrors = {
    nameDuplicated: 'Company with provided name already exists',
  };

  roles = [
    { controlName: 'IsAcknowledgementContact', name: 'Order Approver' },
    { controlName: 'IsBillingContact', name: 'Billing' },
    { controlName: 'IsShippingContact', name: 'Shipping' },
  ];

  form!: FormGroup<CompanyInfoFormModel>;

  constructor(private readonly _fb: FormBuilder) {}

  initForm(data?: Partial<CompanyInfoFormModel>): void {
    this.form = this.createForm(data);
  }

  private createForm(data?: Partial<CompanyInfoFormModel>): FormGroup {
    const formGroup = this._fb.group({
      Id: [0],
      IsCustomer: [true],
      Name: [
        data?.Name ?? '',
        {
          validators: [
            Validators.required,
            Validators.maxLength(
              AsiProjectCreateCustomerFormPresenter.validation.name.maxLength
            ),
          ],
          updateOn: 'blur',
        },
      ],
      GivenName: new FormControl(data?.GivenName ?? '', [
        Validators.required,
        Validators.maxLength(
          AsiProjectCreateCustomerFormPresenter.validation.givenName.maxLength
        ),
      ]),
      FamilyName: new FormControl(data?.FamilyName ?? '', [
        Validators.required,
        Validators.maxLength(
          AsiProjectCreateCustomerFormPresenter.validation.familyName.maxLength
        ),
      ]),
      PrimaryEmail: this.newEmailGroup(data?.PrimaryEmail),
      Address: this.getAddressGroup(data?.Address),
      Phone: this.newPhoneGroup(data?.Phone),
      BrandInformation: this.newBrandInformationGroup(data?.BrandInformation),
      IsAcknowledgementContact: new FormControl(
        data?.IsAcknowledgementContact || false
      ),
      IsBillingContact: new FormControl(data?.IsBillingContact || false),
      IsShippingContact: new FormControl(data?.IsShippingContact || false),
    });

    if (data && Object.keys(data).length) {
      formGroup.markAsDirty();
    }

    return formGroup;
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

  private newBrandInformationGroup(
    brandInformation?: BrandInformation
  ): FormGroup<BrandInformation> {
    return this._fb.group({
      Websites: this.newWebsiteGroup(brandInformation?.Website),
      PrimaryBrandColor: [brandInformation?.PrimaryBrandColor || DEFAULT_COLOR],
      LogoMediaLink: [brandInformation?.LogoMediaLink || null],
      IconMediaLink: [brandInformation?.IconMediaLink || null],
    });
  }

  private newWebsiteGroup(website?: Website): FormGroup<Website> {
    return this._fb.group({
      Id: [0],
      IsPrimary: [false],
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
}
