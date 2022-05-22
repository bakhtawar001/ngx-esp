import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CosButtonModule } from '@cosmos/components/button';
import { CosInputModule } from '@cosmos/components/input';
import { CosInlineEditComponent } from './inline-edit.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, CosInputModule, CosButtonModule],
  exports: [CosInlineEditComponent],
  declarations: [CosInlineEditComponent],
})
export class CosInlineEditModule {}
