import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosAutocompleteModule } from '@cosmos/components/autocomplete';
import { FormGroup, FormGroupComponent } from '@cosmos/forms';
import { CreditTerm } from '@esp/lookup-types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';
import {
  FINANCIAL_DETAILS_LOCAL_STATE,
  FinancialDetailsLocalState,
} from '../../local-states';

// for purpose of this component only, on API model it's designed as string[] field
type FormModel = { CreditTerms: string };

const EMPTY_VALUE = ' ' as const;

@UntilDestroy()
@Component({
  selector: 'asi-credit-terms-panel-form',
  templateUrl: './credit-terms-panel.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiCreditTermsPanelForm
  extends FormGroupComponent<FormModel>
  implements AfterContentInit
{
  private readonly state$ = this.state.connect(this);

  creditTerms: CreditTerm[] = [];

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(FINANCIAL_DETAILS_LOCAL_STATE)
    public readonly state: FinancialDetailsLocalState
  ) {
    super();
  }

  ngAfterContentInit(): void {
    this.listenToState();
  }

  onSave(): void {
    this.state.save({ CreditTerms: [this.form.value.CreditTerms] });

    if (this.form.value.CreditTerms === EMPTY_VALUE) {
      this.form.controls.CreditTerms.setValue('');
    }
  }

  protected override createForm(): FormGroup<FormModel> {
    return this._fb.group<FormModel>({
      CreditTerms: '',
    });
  }

  private listenToState(): void {
    this.state$
      .pipe(
        filter(
          ({ partyIsReady, partyLookups }) =>
            partyIsReady && !!partyLookups.CreditTerms?.length
        ),
        untilDestroyed(this)
      )
      .subscribe(({ party, partyLookups }) => {
        this.initCreditTerms(partyLookups.CreditTerms);
        this.form?.reset({ CreditTerms: party.CreditTerms?.[0] ?? '' });
      });
  }

  // this method have to be called before form reset, because autocomplete has to have
  // options values first
  private initCreditTerms(creditTerms: CreditTerm[]): void {
    this.creditTerms = [
      {
        Code: '',
        Name: EMPTY_VALUE,
        Description: 'Empty value',
        Sequence: 0,
      },
      ...creditTerms,
    ];
    this.changeDetectorRef.detectChanges();
  }
}

@NgModule({
  declarations: [AsiCreditTermsPanelForm],
  exports: [AsiCreditTermsPanelForm],
  imports: [
    CommonModule,
    AsiPanelEditableRowModule,
    CosAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AsiCreditTermsPanelFormModule {}
