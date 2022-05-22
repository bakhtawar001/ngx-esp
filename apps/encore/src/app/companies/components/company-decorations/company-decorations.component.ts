import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'esp-company-decorations',
  templateUrl: './company-decorations.component.html',
  styleUrls: ['./company-decorations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDecorationsComponent {}

@NgModule({
  declarations: [CompanyDecorationsComponent],
  exports: [CompanyDecorationsComponent],
})
export class CompanyDecorationsComponentModule {}
