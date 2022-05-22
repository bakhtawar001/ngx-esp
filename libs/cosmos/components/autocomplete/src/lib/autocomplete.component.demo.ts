import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cos-autocomplete-component',
  template: `
    <div>
      <cos-autocomplete
        [label]="label"
        [data]="data"
        [mode]="mode"
        [placeholder]="placeholder"
        [searchPlaceholder]="searchPlaceholder"
        [valueSelector]="valueSelector"
        name="autocompleteField"
        [formControl]="control"
        [disabled]="disabled"
        [preventHomeEndKeyPropagation]="preventHomeEndKeyPropagation"
        (onSearch)="onSearch.emit($event)"
        (change)="logChange($event)"
      >
        <ng-template let-option>
          <div>{{ option.person }} - {{ option.type }}</div>
        </ng-template>
      </cos-autocomplete>
      <pre>{{ form() }}</pre>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosAutocompleteDemoComponent implements AfterViewInit, OnDestroy {
  control = new FormControl('');

  @Input() mode!: string;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() searchPlaceholder!: string;
  @Input() data: any;
  @Input() valueSelector!: string;
  @Input() disabled = false;
  @Input() preventHomeEndKeyPropagation = false;

  @Output() onSearch = new EventEmitter<string>();

  private destroy$ = new Subject<void>();

  logChange(t: any) {
    console.log('change', t);
  }

  form() {
    const { value, status, errors, pristine, touched } = this.control;
    return JSON.stringify(
      { value, status, errors, pristine, touched },
      null,
      2
    );
  }

  ngAfterViewInit() {
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((x) => {
      console.log('updated form: ', x);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
