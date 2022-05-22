import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCustomerDropdownComponent } from './customer-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,
    MatSelectModule,
    CosAvatarModule,
    CosButtonModule,
  ],
  exports: [CosCustomerDropdownComponent],
  declarations: [CosCustomerDropdownComponent],
})
export class CosCustomerDropdownModule {}
