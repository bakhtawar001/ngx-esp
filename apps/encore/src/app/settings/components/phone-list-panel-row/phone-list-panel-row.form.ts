import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosPillModule } from '@cosmos/components/pill';
import { FormGroupComponent } from '@cosmos/forms';
import { FindLookupTypeValuePipeModule } from '@esp/lookup-types';
import { Phone, PhoneTypeEnum } from '@esp/models';
import { PARTY_LOCAL_STATE, PartyLocalState } from '@esp/parties';
import { PhoneListFormModule } from '@esp/settings';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged, map } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'esp-phone-list-panel-row-form',
  templateUrl: './phone-list-panel-row.form.html',
  styleUrls: ['./phone-list-panel-row.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneListPanelRowForm extends FormGroupComponent {
  @Input()
  defaultPhoneType = PhoneTypeEnum.Mobile;
  @Input()
  isEditable = true;

  phones: Phone[] = [];

  constructor(
    @Inject(PARTY_LOCAL_STATE) public readonly state: PartyLocalState
  ) {
    super();
    this.initState();
  }

  initState(): void {
    this.state
      .connect(this)
      .pipe(
        map((x) => x.party),
        distinctUntilChanged(isEqual),
        untilDestroyed(this)
      )
      .subscribe((party) => {
        const phones = party?.Phones || [];
        this.form?.reset({ Phones: phones });
        this.phones = phones;
      });
  }

  save(): void {
    this._removeEmptyControls();

    this.state.save(this.form.value);
  }

  private _removeEmptyControls(): void {
    const formArray = this.getFormArray('Phones');

    for (let i = formArray.length - 1; i >= 0; i--) {
      if (!formArray.controls[i].value['Number']) {
        formArray.removeAt(i);
      }
    }

    if (!formArray.value.some((item) => item.IsPrimary)) {
      formArray.controls[0]?.patchValue({ IsPrimary: true });
    }
  }
}

@NgModule({
  declarations: [PhoneListPanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosPillModule,

    AsiPanelEditableRowModule,
    FindLookupTypeValuePipeModule,
    PhoneListFormModule,
  ],
  exports: [PhoneListPanelRowForm],
})
export class PhoneListPanelRowFormModule {}
