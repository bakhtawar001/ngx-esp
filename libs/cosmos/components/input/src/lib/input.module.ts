import { TextFieldModule } from '@angular/cdk/text-field';
import { NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { ErrorStateMatcher } from '@cosmos/components/core';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputDirective } from './input.directive';

@NgModule({
  declarations: [CosInputDirective],
  imports: [TextFieldModule, CosFormFieldModule, CosButtonModule],
  exports: [TextFieldModule, CosFormFieldModule, CosInputDirective],
  providers: [ErrorStateMatcher],
})
export class CosInputModule {}
