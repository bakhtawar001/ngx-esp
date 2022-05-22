import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-input-component',
  template: `
    <div class="cos-form-row">
      <label
        [ngClass]="{
          'cos-form-label': true,
          'cos-accessibly-hidden': !showLabel
        }"
        for="demo"
      >
        {{ label }}
      </label>
      <input
        id="demo"
        cos-input
        [style]="style"
        [type]="type"
        [readonly]="readonly"
        [(ngModel)]="value"
        [attr.disabled]="disabled ? '' : null"
        [placeholder]="placeholder"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosInputDemoComponent {
  @Input() value: string;
  @Input() placeholder: string;
  @Input() showLabel: string;
  @Input() type: string;
  @Input() label: string;
  @Input() style: string;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
}
