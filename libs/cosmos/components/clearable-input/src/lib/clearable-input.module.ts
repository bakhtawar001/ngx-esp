import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CosButtonModule } from '@cosmos/components/button';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosClearableInputComponent } from './clearable-input.component';

@NgModule({
  imports: [
    CommonModule,
    CosFormFieldModule,
    FormsModule,
    CosInputModule,
    CosButtonModule,
  ],
  declarations: [CosClearableInputComponent],
  exports: [CosClearableInputComponent],
})
export class CosClearableInputModule {}
