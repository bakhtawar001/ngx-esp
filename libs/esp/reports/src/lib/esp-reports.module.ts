import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportComponent } from './components';

@NgModule({
  imports: [CommonModule],
  declarations: [ReportComponent],
  exports: [ReportComponent],
})
export class EspReportsModule {}
