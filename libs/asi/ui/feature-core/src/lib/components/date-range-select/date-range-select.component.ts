import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  NgModule,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { DateRange, MatDatepickerModule } from '@angular/material/datepicker';
import { CosCardModule } from '@cosmos/components/card';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { FormBuilder } from '@cosmos/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';

const defaultControlsConfig = {
  start: null,
  end: null,
};

@UntilDestroy()
@Component({
  selector: 'asi-date-range-select',
  templateUrl: './date-range-select.component.html',
  styleUrls: ['./date-range-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AsiDateRangeSelectComponent),
      multi: true,
    },
  ],
})
export class AsiDateRangeSelectComponent
  implements OnInit, ControlValueAccessor
{
  @Input()
  inlinePicker = false;
  @Input()
  label!: string;
  @Output()
  rangeSelected = new EventEmitter<DateRange<Date>>();

  inlinePickerSelectedRange: DateRange<Date> | undefined;
  rangeGroup = this.fb.group<DateRange<Date>>(defaultControlsConfig);
  showInlinePicker = false;

  constructor(private fb: FormBuilder) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (data: DateRange<Date>) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  registerOnTouched = () => {};

  public writeValue(dateRange: DateRange<Date>): void {
    this.inlinePickerSelectedRange = new DateRange<Date>(
      dateRange.start,
      dateRange.end
    );
    this.rangeGroup.setValue(dateRange);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  ngOnInit(): void {
    this.rangeGroup.valueChanges
      .pipe(
        filter((range) => !!range.start && !!range.end),
        untilDestroyed(this)
      )
      .subscribe((range) => this.onChange(range));
  }

  inlinePickerRangeChange(date: Date): void {
    if (
      !this.inlinePickerSelectedRange?.start ||
      this.inlinePickerSelectedRange?.end
    ) {
      this.inlinePickerSelectedRange = new DateRange<Date>(date, null);
    } else {
      const start = this.inlinePickerSelectedRange.start;
      const end = date;
      this.inlinePickerSelectedRange = new DateRange<Date>(start, end);

      if (end < start) {
        this.inlinePickerSelectedRange = new DateRange<Date>(end, null);
      } else {
        this.inlinePickerSelectedRange = new DateRange<Date>(start, end);
        this.toggleInlinePicker();
      }
    }

    this.rangeGroup.controls.start.setValue(
      this.inlinePickerSelectedRange.start
    );
    this.rangeGroup.controls.end.setValue(this.inlinePickerSelectedRange.end);
  }

  toggleInlinePicker(): void {
    this.showInlinePicker = !this.showInlinePicker;
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    CosFormFieldModule,
    CosInputModule,
    ReactiveFormsModule,
    CosCardModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  declarations: [AsiDateRangeSelectComponent],
  exports: [AsiDateRangeSelectComponent],
})
export class AsiDateRangeSelectModule {}
