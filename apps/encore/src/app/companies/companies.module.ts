import { NgModule } from '@angular/core';
import { EspCompaniesModule } from '@esp/companies';
import { CompaniesRoutingModule } from './companies-routing.module';

@NgModule({
  imports: [CompaniesRoutingModule, EspCompaniesModule],
})
export class CompaniesModule {}
