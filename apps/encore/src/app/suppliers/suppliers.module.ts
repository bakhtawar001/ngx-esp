import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EspSuppliersModule } from '@esp/suppliers';
import { SmartlinkSuppliersModule } from '@smartlink/suppliers';
import { SuppliersRoutingModule } from './suppliers-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SmartlinkSuppliersModule,
    SuppliersRoutingModule,
    EspSuppliersModule,
  ],
})
export class SuppliersModule {}
