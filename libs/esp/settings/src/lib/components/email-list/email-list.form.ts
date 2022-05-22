import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidateEmail } from '@cosmos/common';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosInputModule } from '@cosmos/components/input';
import { CosInputRowModule } from '@cosmos/components/input-row';
import { FormArrayComponent, FormGroup } from '@cosmos/forms';
import { EspLookupSelectComponentModule } from '@esp/lookup-types';
import { Email } from '@esp/models';

export enum EmailType {
  Artwork = 'Artwork',
  Order = 'Order',
  Work = 'Work',
}

@Component({
  selector: 'esp-email-list-form',
  templateUrl: './email-list.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailListForm extends FormArrayComponent<Email> {
  @Input() showPrimary = true;

  makePrimary(index: number): void {
    this.form.controls
      .filter((_, i) => i !== index)
      .forEach((ctrl) => {
        ctrl.patchValue({ IsPrimary: false });
      });
  }

  protected createArrayControl(): FormGroup<Email> {
    return this._fb.group<Email>({
      Id: 0,
      IsPrimary: [false],
      Type: [EmailType.Work],
      Address: ['', [ValidateEmail]],
    });
  }
}

@NgModule({
  declarations: [EmailListForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosButtonModule,
    CosCheckboxModule,
    CosInputModule,
    CosInputRowModule,

    EspLookupSelectComponentModule,
  ],
  exports: [EmailListForm],
})
export class EmailListFormModule {}
