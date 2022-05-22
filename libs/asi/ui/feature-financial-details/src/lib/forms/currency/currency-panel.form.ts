import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CurrencyDirectiveModule } from '@cosmos/common';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { FormGroup, FormGroupComponent } from '@cosmos/forms';
import { InputMaskModule } from '@ngneat/input-mask';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs/operators';
import {
  FINANCIAL_DETAILS_LOCAL_STATE,
  FinancialDetailsLocalState,
} from '../../local-states';
import { FinancialDetails } from '../../models';

type FormModel = Pick<FinancialDetails, 'Currency'>;

@UntilDestroy()
@Component({
  selector: 'asi-currency-panel-form',
  templateUrl: './currency-panel.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiCurrencyPanelForm extends FormGroupComponent<FormModel> {
  readonly DEFAULT_CURRENCY = '$';

  private readonly state$ = this.state.connect(this);

  constructor(
    @Inject(FINANCIAL_DETAILS_LOCAL_STATE)
    public readonly state: FinancialDetailsLocalState
  ) {
    super();

    this.listenToState();
  }

  onSave(): void {
    this.state.save(this.form.value);
  }

  protected override createForm(): FormGroup<FormModel> {
    return this._fb.group<FormModel>({
      Currency: this.DEFAULT_CURRENCY,
    });
  }

  private listenToState(): void {
    this.state$
      .pipe(
        filter(({ partyIsReady }) => partyIsReady),
        map(({ party }) => party),
        untilDestroyed(this)
      )
      .subscribe(({ Currency }: FinancialDetails) => {
        this.form?.reset({ Currency });
      });
  }
}

@NgModule({
  declarations: [AsiCurrencyPanelForm],
  exports: [AsiCurrencyPanelForm],
  imports: [
    CommonModule,
    AsiPanelEditableRowModule,
    CosFormFieldModule,
    CurrencyDirectiveModule,
    FormsModule,
    InputMaskModule,
    ReactiveFormsModule,
  ],
})
export class AsiCurrencyPanelFormModule {}
