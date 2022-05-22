import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosFiltersModule } from '@cosmos/components/filters';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { UniqueIdService } from '@cosmos/core';
import { CosDropdownFilterComponent } from './dropdown-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CosFiltersModule,
    CosInputModule,
    CosFormFieldModule,
    CosCheckboxModule,
    CosButtonModule,
  ],
  exports: [CosDropdownFilterComponent],
  declarations: [CosDropdownFilterComponent],
  providers: [UniqueIdService],
})
export class CosDropdownFilterModule {}
