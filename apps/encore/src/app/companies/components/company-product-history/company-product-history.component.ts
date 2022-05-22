import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'esp-company-product-history',
  templateUrl: './company-product-history.component.html',
  styleUrls: ['./company-product-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyProductHistoryComponent {}

@NgModule({
  declarations: [CompanyProductHistoryComponent],
  exports: [CompanyProductHistoryComponent],
})
export class CompanyProductHistoryComponentModule {}
