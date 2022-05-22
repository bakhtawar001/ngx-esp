import { NgModule } from '@angular/core';
import { EspProductsModule } from '@esp/products';
import { SmartlinkProductsModule } from '@smartlink/products';
import { SmartlinkSuppliersModule } from '@smartlink/suppliers';
import { EspCompaniesModule } from '@esp/companies';
import { ProductsRoutingModule } from './products-routing.module';

@NgModule({
  imports: [
    EspProductsModule,
    SmartlinkProductsModule,
    SmartlinkSuppliersModule,
    ProductsRoutingModule,
    EspCompaniesModule,
  ],
})
export class ProductsModule {}
