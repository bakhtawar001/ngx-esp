import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ProductSearchState, ProductsState } from './states';

@NgModule({
  imports: [NgxsModule.forFeature([ProductsState, ProductSearchState])],
})
export class SmartlinkProductsModule {}
