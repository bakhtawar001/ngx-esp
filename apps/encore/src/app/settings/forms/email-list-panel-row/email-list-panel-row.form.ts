import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosPillModule } from '@cosmos/components/pill';
import { trackItem } from '@cosmos/core';
import { FormGroupComponent } from '@cosmos/forms';
import { FindLookupTypeValuePipeModule } from '@esp/lookup-types';
import { Email } from '@esp/models';
import { PARTY_LOCAL_STATE, PartyLocalState } from '@esp/parties';
import { EmailListFormModule } from '@esp/settings';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged, map } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'esp-email-list-panel-row-form',
  templateUrl: './email-list-panel-row.form.html',
  styleUrls: ['./email-list-panel-row.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailListPanelRowForm
  extends FormGroupComponent<{ Emails: Email[] }>
  implements AfterContentInit
{
  // @TODO remove this kind of inputs in favor of IsEditable on Party model
  @Input()
  isEditable = true;

  emails: Email[] = [];

  readonly trackByFn = trackItem<Email>(['Id']);

  private readonly state$ = this.state.connect(this);

  constructor(
    @Inject(PARTY_LOCAL_STATE) public readonly state: PartyLocalState
  ) {
    super();
  }

  ngAfterContentInit(): void {
    this.state$
      .pipe(
        map((x) => x.party),
        distinctUntilChanged(isEqual),
        untilDestroyed(this)
      )
      .subscribe({
        next: (contact) => {
          const emails = contact?.Emails || [];
          // form array is having trouble with order of the groups, so first reset it to empty state
          // then set a value
          this.form.reset({ Emails: [] });
          this.form.setValue({ Emails: emails });
          this.emails = emails;
        },
      });
  }

  save(): void {
    this._removeEmptyControls();

    this.state.save(this.form.value);
  }

  private _removeEmptyControls(): void {
    const formArray = this.getFormArray('Emails');

    for (let i = formArray.length - 1; i >= 0; i--) {
      if (!formArray.controls[i].value['Address']) {
        formArray.removeAt(i);
      }
    }

    if (!formArray.value.some((item) => item.IsPrimary)) {
      formArray.controls[0]?.patchValue({ IsPrimary: true });
    }
  }
}

@NgModule({
  declarations: [EmailListPanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosPillModule,

    AsiPanelEditableRowModule,
    FindLookupTypeValuePipeModule,
    EmailListFormModule,
  ],
  exports: [EmailListPanelRowForm],
})
export class EmailListPanelRowFormModule {}
