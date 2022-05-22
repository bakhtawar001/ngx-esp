import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationModule } from '@cosmos/layout';
import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [CommonModule, MatIconModule, NavigationModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
