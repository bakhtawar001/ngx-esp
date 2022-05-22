import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { SupplierSearchState } from './states';

@NgModule({
  imports: [NgxsModule.forFeature([SupplierSearchState])],
})
export class EspSuppliersModule {}
