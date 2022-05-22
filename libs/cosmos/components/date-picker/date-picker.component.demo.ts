import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'cos-date-picker-demo-component',
  template: `
    <cos-form-field appearance="fill" class="date-picker">
      <cos-label
        [ngClass]="{
          'cos-accessibly-hidden': !showLabel
        }"
        >{{ label }}</cos-label
      >
      <span
        cosPrefix
        class="fa fa-calendar-alt cos-text--blue"
        (click)="picker.open()"
      ></span>
      <input
        cos-input
        class="mat-select"
        [matDatepicker]="picker"
        [formControl]="dateTime"
        placeholder="mm/dd/yyyy"
        [style]="style"
        [disabled]="disabled"
        [attr.disabled]="disabled ? '' : null"
        (click)="picker.open()"
      />
      <mat-datepicker #picker></mat-datepicker>
    </cos-form-field>
  `,
})
export class CosDatePickerDemoComponent implements OnInit, OnChanges {
  @Input() style: string;
  @Input() value: Date;

  dateTime: FormControl;

  ngOnInit(): void {
    this.dateTime = new FormControl(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dateTime = new FormControl(this.value);
  }

  getSize() {
    if (!this.style) return;
    return `cos-date-picker--${this.style}`;
  }
}
