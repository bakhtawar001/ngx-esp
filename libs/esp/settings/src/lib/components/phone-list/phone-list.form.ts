import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosInputModule } from '@cosmos/components/input';
import { CosInputRowModule } from '@cosmos/components/input-row';
import { FormArrayComponent } from '@cosmos/forms';
import { EspLookupSelectComponentModule } from '@esp/lookup-types';
import { Phone, PhoneTypeEnum } from '@esp/models';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-phone-list-form',
  templateUrl: './phone-list.form.html',
  styleUrls: ['./phone-list.form.scss'],
})
export class PhoneListForm extends FormArrayComponent<Phone> {
  @Input() showPrimary = true;
  @Input() defaultPhoneType = PhoneTypeEnum.Mobile;

  makePrimary(index) {
    this.form.controls
      .filter((_, i) => i !== index)
      .forEach((ctrl) => {
        ctrl.patchValue({ IsPrimary: false });
      });
  }

  protected createArrayControl() {
    return this._fb.group<Phone>({
      Country: ['US'],
      IsPrimary: [false],
      Number: [''],
      PhoneCode: ['1'],
      Type: [this.defaultPhoneType],
    });
  }
}

@NgModule({
  declarations: [PhoneListForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosButtonModule,
    CosCheckboxModule,
    CosInputModule,
    CosInputRowModule,

    EspLookupSelectComponentModule,
  ],
  exports: [PhoneListForm],
})
export class PhoneListFormModule {}
