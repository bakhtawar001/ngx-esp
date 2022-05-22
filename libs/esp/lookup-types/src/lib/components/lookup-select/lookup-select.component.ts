import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  NgModule,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { ReactiveComponent } from '@cosmos/common';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { LookupTypeKey } from '../../models';
import { LookupTypeQueries } from '../../queries';

interface BasicLookup {
  Code: string;
  Name: string;
}

@UntilDestroy()
@Component({
  selector: 'esp-lookup-select',
  templateUrl: './lookup-select.component.html',
  styleUrls: ['./lookup-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EspLookupSelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EspLookupSelectComponent
  extends ReactiveComponent
  implements OnInit, ControlValueAccessor
{
  selectValue = new FormControl();

  @Input() type: Exclude<LookupTypeKey, 'OrderStatuses' | 'Tags'>;
  @Input() placeholder: string;
  @Input() showLabel = true;

  @Input()
  set value(value: string) {
    if (this.state.types) {
      const code = this.state.types?.find(
        (type) => type.Name === this.value
      )?.Code;

      if (code) {
        value = code;
      }
    }

    this.selectValue.setValue(value);

    this.onChange(value);
    this.onTouched();
  }
  get value(): string {
    return this.selectValue.value;
  }
  private _value: string;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: any = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: any = () => {};

  constructor(private readonly store: Store) {
    super();
  }

  override ngOnInit(): void {
    this.selectValue.valueChanges
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => this.writeValue(value));

    super.ngOnInit();
  }

  writeValue(val): void {
    if (val) {
      this.value = val;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.selectValue.disable();
    } else {
      this.selectValue.enable();
    }
  }

  override setState() {
    this.state = this.connect({
      types: this.store
        .select<BasicLookup[]>(LookupTypeQueries.lookups[this.type])
        .pipe(
          tap((types) => {
            const code = types?.find((type) => type.Name === this.value)?.Code;

            if (code && code !== this.value) {
              this.value = code;
            }
          })
        ),
    });
  }
}

@NgModule({
  declarations: [EspLookupSelectComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CosFormFieldModule,
    CosInputModule,
  ],
  exports: [EspLookupSelectComponent],
})
export class EspLookupSelectComponentModule {}
