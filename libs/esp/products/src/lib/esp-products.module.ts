import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ProductSearchState } from './states';

@NgModule({
  imports: [NgxsModule.forFeature([ProductSearchState])],
})
export class EspProductsModule {}
