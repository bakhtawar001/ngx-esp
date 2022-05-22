import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NavigationModule, ResizeObserverModule } from '@cosmos/layout';
import { NavbarModalModule } from './navbar-modal.component';
import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NavigationModule,
    ResizeObserverModule,

    MatDialogModule,
    MatIconModule,

    NavbarModalModule,
  ],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
