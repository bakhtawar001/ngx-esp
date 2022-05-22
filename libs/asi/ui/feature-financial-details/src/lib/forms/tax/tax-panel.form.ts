import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import {
  FINANCIAL_DETAILS_LOCAL_STATE,
  FinancialDetailsLocalState,
} from '../../local-states';

@Component({
  selector: 'asi-tax-panel-form',
  templateUrl: './tax-panel.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiTaxPanelForm {
  constructor(
    @Inject(FINANCIAL_DETAILS_LOCAL_STATE)
    public readonly state: FinancialDetailsLocalState
  ) {
    this.state.connect(this);
  }

  onToggleChange(): void {
    this.state.save({ IsTaxExempt: !this.state.party.IsTaxExempt });
  }
}

@NgModule({
  declarations: [AsiTaxPanelForm],
  exports: [AsiTaxPanelForm],
  imports: [CommonModule, AsiPanelEditableRowModule, CosSlideToggleModule],
})
export class AsiTaxPanelFormModule {}
