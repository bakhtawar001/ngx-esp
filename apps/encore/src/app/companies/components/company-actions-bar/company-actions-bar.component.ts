import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';
import { CompaniesDialogService } from '../../services';
import { CompanyActionsBarLocalState } from './company-actions-bar.local-state';

@UntilDestroy()
@Component({
  selector: 'esp-company-actions-bar',
  templateUrl: './company-actions-bar.component.html',
  styleUrls: ['./company-actions-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CompanyActionsBarLocalState],
})
export class CompanyActionsBarComponent {
  constructor(
    public readonly state: CompanyActionsBarLocalState,
    private readonly _companiesDialogService: CompaniesDialogService
  ) {
    this.state.connect(this);
  }

  createCompany(id = 0) {
    this._companiesDialogService
      .createCompany({
        companyId: id,
        type: this.state.searchType?.type,
      })
      .pipe(filter(Boolean), untilDestroyed(this))
      .subscribe((company) => {
        this.state.search(this.state.criteria);
      });
  }
}

@NgModule({
  declarations: [CompanyActionsBarComponent],
  imports: [CommonModule, MatMenuModule, CosButtonModule],
})
export class CompanyActionsBarComponentModule {}
