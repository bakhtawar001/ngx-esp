import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EspCompaniesModule } from '@esp/companies';

import { CollectionsRoutingModule } from './collections-routing.module';

@NgModule({
  imports: [CommonModule, CollectionsRoutingModule, EspCompaniesModule],
})
export class CollectionsModule {}
