import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AsiFormatToPercentageModule,
  AsiPanelEditableRowModule,
} from '@asi/ui/feature-core';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { FormGroup, FormGroupComponent } from '@cosmos/forms';
import { createMask, InputMaskModule } from '@ngneat/input-mask';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs/operators';
import {
  FINANCIAL_DETAILS_LOCAL_STATE,
  FinancialDetailsLocalState,
} from '../../local-states';
import { FinancialDetails } from '../../models';

type FormModel = Pick<FinancialDetails, 'MinimumMargin'>;

@UntilDestroy()
@Component({
  selector: 'asi-minimum-margin-panel-form',
  templateUrl: './minimum-margin-panel.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiMinimumMarginPanelForm extends FormGroupComponent<FormModel> {
  readonly minimumMarginMask = createMask({
    alias: 'numeric',
    groupSeparator: ',',
    digits: 0,
    allowMinus: false,
    showMaskOnHover: false,
    rightAlign: false,
  });

  private readonly state$ = this.state.connect(this);

  constructor(
    @Inject(FINANCIAL_DETAILS_LOCAL_STATE)
    public readonly state: FinancialDetailsLocalState
  ) {
    super();

    this.listenToState();
  }

  onSave(): void {
    // It's divided by 100 because provided value is presented in the percentage but need to be updated as raw value.
    this.state.save({
      MinimumMargin: (this.form.value.MinimumMargin as number) / 100,
    });
  }

  protected override createForm(): FormGroup<FormModel> {
    return this._fb.group<FormModel>({
      MinimumMargin: [0, [Validators.max(999), Validators.min(0)]],
    });
  }

  private listenToState(): void {
    this.state$
      .pipe(
        filter(({ partyIsReady }) => partyIsReady),
        map(({ party }) => party),
        untilDestroyed(this)
      )
      .subscribe(({ MinimumMargin }: FinancialDetails) => {
        // It's increased by 100 because provided value is raw value but need to be presented in the percentage.
        this.form?.reset({ MinimumMargin: (MinimumMargin as number) * 100 });
      });
  }
}

@NgModule({
  declarations: [AsiMinimumMarginPanelForm],
  exports: [AsiMinimumMarginPanelForm],
  imports: [
    CommonModule,
    AsiPanelEditableRowModule,
    CosFormFieldModule,
    CosInputModule,
    FormsModule,
    ReactiveFormsModule,
    InputMaskModule,
    AsiFormatToPercentageModule,
  ],
})
export class AsiMinimumMarginPanelFormModule {}
