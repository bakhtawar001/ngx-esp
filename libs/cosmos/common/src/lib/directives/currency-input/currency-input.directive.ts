import { CommonModule } from '@angular/common';
import { Directive, Host, NgModule } from '@angular/core';
import { CosFormFieldControlDirective } from '@cosmos/components/form-field';
import { CosInputDirective } from '@cosmos/components/input';
import { UniqueIdService } from '@cosmos/core';
import { createMask, InputMaskDirective } from '@ngneat/input-mask';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[cos-currency-input]',
  providers: [
    CosInputDirective,
    UniqueIdService,
    { provide: CosFormFieldControlDirective, useExisting: CosInputDirective },
  ],
})
export class CosInputHelperDirective extends CosInputDirective {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[cos-currency-input]',
})
export class CosInputMaskHelperDirective extends InputMaskDirective {
  override inputMask = createMask({
    alias: 'numeric',
    groupSeparator: ',',
    digits: 2,
    digitsOptional: false,
    allowMinus: false,
    rightAlign: false,
    showMaskOnHover: false,
  });
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[cos-currency-input]',
})
export class CurrencyInputDirective {
  constructor(
    @Host() public inputDir: CosInputHelperDirective,
    @Host() public maskDir: CosInputMaskHelperDirective
  ) {}
}

@NgModule({
  declarations: [
    CurrencyInputDirective,
    CosInputHelperDirective,
    CosInputMaskHelperDirective,
  ],
  imports: [CommonModule],
  exports: [
    CurrencyInputDirective,
    CosInputHelperDirective,
    CosInputMaskHelperDirective,
  ],
  providers: [CosInputDirective],
})
export class CurrencyDirectiveModule {}
