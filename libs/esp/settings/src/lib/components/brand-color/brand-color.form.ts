import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  NgModule,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { FormControl, FormControlComponent } from '@cosmos/forms';
import { ColorPickerModule } from 'ngx-color-picker';

export const DEFAULT_COLOR = '#6A7281';
export const COLOR_VALIDATION_PATTERN = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

@Component({
  selector: 'esp-brand-color-form',
  styleUrls: ['./brand-color.form.scss'],
  templateUrl: './brand-color.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EspBrandColorForm),
      multi: true,
    },
  ],
})
export class EspBrandColorForm
  extends FormControlComponent<string>
  implements ControlValueAccessor
{
  @Input()
  label = '';

  defaultColor = DEFAULT_COLOR;

  constructor() {
    super();
  }

  registerOnChange: (value: string) => void = () => '';
  registerOnTouched: () => void = () => '';
  writeValue: () => void = () => '';

  // registerOnChange(fn: (value: string) => void): void {
  //   this.onChange = fn;
  // }

  // registerOnTouched(fn: () => void): void {
  //   this.onTouched = fn;
  // }

  // writeValue(fn: () => void): void {
  //   this.onWriteValue = fn;
  // }

  protected override createForm(): FormControl<string> {
    return this._fb.control<string>(DEFAULT_COLOR, [
      Validators.pattern(COLOR_VALIDATION_PATTERN),
    ]);
  }
}

@NgModule({
  declarations: [EspBrandColorForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CosFormFieldModule,
    CosInputModule,
    ColorPickerModule,
  ],
  exports: [EspBrandColorForm],
})
export class EspBrandColorFormModule {}
