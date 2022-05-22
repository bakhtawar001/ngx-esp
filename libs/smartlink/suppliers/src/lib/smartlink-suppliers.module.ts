import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { SuppliersState } from './states';

@NgModule({
  imports: [NgxsModule.forFeature([SuppliersState])],
})
export class SmartlinkSuppliersModule {}
