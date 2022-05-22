import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { LookupTypesState } from './states';

@NgModule({
  imports: [NgxsModule.forFeature([LookupTypesState])],
})
export class EspLookupTypesModule {}
