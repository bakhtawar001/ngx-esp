import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EspCompaniesModule } from '@esp/companies';
import { EspContactsModule } from '@esp/contacts';
import { DirectoryRoutingModule } from './directory-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    EspCompaniesModule,
    EspContactsModule,

    DirectoryRoutingModule,
  ],
})
export class DirectoryModule {}
