import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CosmosLayoutModule } from '@cosmos/layout';
import { NavbarModule, ToolbarModule } from './components';
import { EspLayoutComponent } from './esp-layout.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    CosmosLayoutModule,

    NavbarModule,
    ToolbarModule,
  ],
  declarations: [EspLayoutComponent],
  exports: [EspLayoutComponent],
})
export class EspLayoutModule {}
