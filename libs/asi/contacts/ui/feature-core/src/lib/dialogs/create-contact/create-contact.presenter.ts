import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@cosmos/forms';
import {
  Address,
  Email,
  Phone,
  PhoneTypeEnum,
  Website,
  WebsiteTypeEnum,
} from '@esp/models';
import { CompanyPayload, CreateContactForm } from './models';
import { ValidateEmail, ValidateUrl } from '@cosmos/common';
import { Validators } from '@angular/forms';

@Injectable()
export class CreateContactPresenter {
  static readonly validation = {
    givenName: {
      maxLength: 50,
    },
    familyName: {
      maxLength: 50,
    },
    title: {
      maxLength: 50,
    },
  };

  form!: FormGroup<CreateContactForm>;

  constructor(private _fb: FormBuilder) {}

  initForm(data?: Partial<CreateContactForm>): void {
    this.form = this.createContactForm(data);
  }

  createContactForm(
    data?: Partial<CreateContactForm>
  ): FormGroup<CreateContactForm> {
    return this._fb.group({
      FamilyName: [
        '',
        [
          Validators.required,
          Validators.maxLength(
            CreateContactPresenter.validation.familyName.maxLength
          ),
        ],
      ],
      GivenName: [
        '',
        [
          Validators.required,
          Validators.maxLength(
            CreateContactPresenter.validation.givenName.maxLength
          ),
        ],
      ],
      CompanyPayload: this.newCompanyGroup(data?.CompanyPayload),
      Address: this.newAddressGroup(),
      PrimaryEmail: this.newEmailGroup(),
      Phone: this.newPhoneGroup(),
      Website: this.newWebsiteGroup(),
    });
  }

  private newCompanyGroup(
    data?: Partial<CompanyPayload>
  ): FormGroup<CompanyPayload> {
    return this._fb.group({
      Company: [data?.Company ?? {}],
      Title: [
        data?.Title ?? '',
        [
          Validators.maxLength(
            CreateContactPresenter.validation.title.maxLength
          ),
        ],
      ],
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
      Type: [phone?.Type || PhoneTypeEnum.Mobile],
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

  private newAddressGroup(address?: Address): FormGroup<Address> {
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
