import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { EspSearchBoxModule } from '@esp/search';

@Component({
  selector: 'esp-company-notes',
  templateUrl: './company-notes.component.html',
  styleUrls: ['./company-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyNotesComponent {}

@NgModule({
  declarations: [CompanyNotesComponent],
  exports: [CompanyNotesComponent],
  imports: [EspSearchBoxModule],
})
export class CompanyNotesComponentModule {}
