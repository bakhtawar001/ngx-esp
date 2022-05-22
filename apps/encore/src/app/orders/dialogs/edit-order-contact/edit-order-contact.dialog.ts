import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { InitialsPipeModule } from '@cosmos/common';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import {
  CosConfirmDialog,
  CosConfirmDialogModule,
} from '@cosmos/components/confirm-dialog';
import { OrderContact } from '@esp/models';
import { getOrderDocumentTypeName } from '@esp/orders';
import { EditOrderContactDetailsComponentModule } from '../../components/edit-order-contact-details';
import {
  EditOrderContactDialogData,
  EditOrderContactDialogResult,
} from './edit-order-contact.dialog.models';

@Component({
  selector: 'esp-edit-order-contact-dialog',
  templateUrl: './edit-order-contact.dialog.html',
  styleUrls: ['./edit-order-contact.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditOrderContactDialog {
  public orderContact: OrderContact = null;
  public title = 'Add/Edit Order Contact';
  public orderTypeDesc = 'Order';

  public form = this.createForm();

  public newOwner = new FormControl();

  get newOwnerSelected() {
    return !!this.newOwner.value;
  }

  constructor(
    private _dialogRef: MatDialogRef<
      EditOrderContactDialog,
      EditOrderContactDialogResult
    >,
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: EditOrderContactDialogData
  ) {
    this.orderContact = data.orderContact;
    this.orderTypeDesc = getOrderDocumentTypeName(data.orderType);
    this.title = data.title || this.title;

    this._dialogRef.disableClose = true;
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this._dialogRef.backdropClick().subscribe(() => this.confirmClose());
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this._dialogRef.afterOpened().subscribe(() => {
      this.form.patchValue({
        orderContact: this.orderContact,
      });
    });
  }

  save() {
    this._dialogRef.close(this.newOwner.value);
  }

  cancel() {
    this._dialogRef.close({ cancelled: true });
  }

  private createForm() {
    return this._fb.group({});
  }

  private confirmClose() {
    if (this.form.pristine) {
      this.cancel();
      return;
    }
    const dialog = this._dialog.open(CosConfirmDialog, {
      minWidth: '400px',
      width: '400px',
      data: {
        message: `Are you sure you want to lose your changes?`,
        confirm: 'Yes',
        cancel: 'No',
        confirmColor: 'warn',
      },
    });

    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    dialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cancel();
      }
    });
  }
}

@NgModule({
  declarations: [EditOrderContactDialog],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatDialogModule,

    CosAvatarModule,
    CosButtonModule,
    CosConfirmDialogModule,

    InitialsPipeModule,

    EditOrderContactDetailsComponentModule,
  ],
})
export class EditOrderContactDialogModule {}
