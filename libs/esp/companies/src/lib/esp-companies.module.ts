import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import {
  CompaniesSearchState,
  CompaniesState,
  CompaniesRecentState,
} from './states';

@NgModule({
  imports: [
    NgxsModule.forFeature([
      CompaniesState,
      CompaniesSearchState,
      CompaniesRecentState,
    ]),
  ],
})
export class EspCompaniesModule {}
