import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { CosmosLayoutModule } from '@cosmos/layout';
import { NavbarModule } from './components';

import { EspLayoutAdminComponent } from './esp-layout-admin.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    CosmosLayoutModule,

    NavbarModule,
  ],
  declarations: [EspLayoutAdminComponent],
  exports: [EspLayoutAdminComponent],
})
export class EspLayoutAdminModule {}
