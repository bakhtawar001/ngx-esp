import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { ClickOutsideModule } from '@cosmos/common';
import { CosButtonModule } from '@cosmos/components/button';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosAutocompleteComponent } from './autocomplete.component';

@NgModule({
  imports: [
    OverlayModule,
    CommonModule,
    CosFormFieldModule,
    FormsModule,
    MatAutocompleteModule,
    MatSelectModule,
    CosInputModule,
    ClickOutsideModule,
    CosButtonModule,
    ReactiveFormsModule,
  ],
  providers: [MatSelectModule],
  declarations: [CosAutocompleteComponent],
  exports: [CosAutocompleteComponent],
})
export class CosAutocompleteModule {}
