import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  OnInit,
  Inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateContactPresenter } from './create-contact.presenter';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { EspLookupSelectComponentModule } from '@esp/lookup-types';
import { CosAddressFormModule } from '@cosmos/components/address-form';
import { CosDialogModule } from '@cosmos/components/dialog';
import { CosButtonModule } from '@cosmos/components/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CreateContactData, CreateContactResult } from './models';
import {
  AsiPartyAutocompleteComponentModule,
  ConfirmDialogService,
} from '@asi/ui/feature-core';
import { firstValueFrom } from 'rxjs';
import { Contact, LinkRelationship } from '@esp/models';

@Component({
  selector: 'esp-create-contact',
  templateUrl: './create-contact.dialog.html',
  styleUrls: ['./create-contact.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreateContactPresenter],
})
export class CreateContactDialog implements OnInit {
  constructor(
    readonly presenter: CreateContactPresenter,
    private readonly _dialogRef: MatDialogRef<
      CreateContactDialog,
      CreateContactResult
    >,
    private readonly _dialog: MatDialog,
    private readonly _confirmDialogService: ConfirmDialogService,
    @Inject(MAT_DIALOG_DATA) private data: CreateContactData
  ) {
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this._dialogRef.backdropClick().subscribe(() => this.onCancel());
  }

  ngOnInit(): void {
    this.presenter.initForm(this.data);
  }

  async onCancel(): Promise<void> {
    if (this.presenter.form.dirty) {
      const confirmDialog = await firstValueFrom(
        this._confirmDialogService.confirmDiscardChanges()
      );

      if (confirmDialog) {
        this._dialogRef.close();
        return;
      }
    } else {
      this._dialogRef.close();
    }
  }

  onCreate(): void {
    this._dialogRef.close(
      this.mapContactFormToContact(this.presenter.form.value)
    );
  }

  private mapContactFormToContact(payload: CreateContactData): Contact {
    return {
      GivenName: payload.GivenName,
      FamilyName: payload.FamilyName,
      Links: [
        {
          Title: payload.CompanyPayload?.Title,
          To: {
            Id: payload.CompanyPayload?.Company.Id,
            ...payload.CompanyPayload?.Company,
          },
        } as LinkRelationship,
      ],
      Emails: payload.PrimaryEmail ? [payload.PrimaryEmail] : [],
      Phones: payload.Phone ? [payload.Phone] : [],
      Addresses: payload.Address
        ? [
            {
              ...payload.Address,
              Name: `${payload.GivenName} ${payload.FamilyName}`,
            },
          ]
        : [],
      Websites: payload.Website?.Url.length ? [payload.Website] : [],
    } as Contact;
  }
}

@NgModule({
  imports: [
    CommonModule,
    CosButtonModule,
    CosDialogModule,
    CosFormFieldModule,
    CosInputModule,
    AsiPartyAutocompleteComponentModule,
    EspLookupSelectComponentModule,
    CosAddressFormModule,
    ReactiveFormsModule,
  ],
  declarations: [CreateContactDialog],
  exports: [CreateContactDialog],
})
export class CreateContactDialogModule {}
