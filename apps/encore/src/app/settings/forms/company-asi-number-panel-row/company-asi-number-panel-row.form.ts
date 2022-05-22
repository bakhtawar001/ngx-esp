import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { ProfilePageLocalState } from '../../local-state';

@Component({
  selector: 'esp-company-asi-number-panel-row-form',
  templateUrl: './company-asi-number-panel-row.form.html',
  styleUrls: ['./company-asi-number-panel-row.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyAsiNumberPanelRowForm {
  constructor(public state: ProfilePageLocalState) {
    state.connect(this);
  }
}

@NgModule({
  declarations: [CompanyAsiNumberPanelRowForm],
  imports: [CommonModule, AsiPanelEditableRowModule],
  exports: [CompanyAsiNumberPanelRowForm],
})
export class CompanyAsiNumberPanelRowFormModule {}
