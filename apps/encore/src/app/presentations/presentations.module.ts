import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EspCompaniesModule } from '@esp/companies';
import { SmartlinkSuppliersModule } from '@smartlink/suppliers';
import { PresentationsRoutingModule } from './presentations-routing.module';

@NgModule({
  imports: [
    CommonModule,
    EspCompaniesModule,
    SmartlinkSuppliersModule,
    PresentationsRoutingModule,
  ],
})
export class PresentationsModule {}
