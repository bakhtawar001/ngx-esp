import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'esp-company-activity',
  templateUrl: './company-activity.component.html',
  styleUrls: ['./company-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyActivityComponent {}

@NgModule({
  declarations: [CompanyActivityComponent],
  exports: [CompanyActivityComponent],
})
export class CompanyActivityComponentModule {}
