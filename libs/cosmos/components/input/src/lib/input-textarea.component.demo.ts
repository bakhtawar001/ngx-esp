import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-input-textarea-demo-component',
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
      <textarea
        id="demo"
        cos-input
        [style]="style"
        [(ngModel)]="value"
        [attr.disabled]="disabled ? '' : null"
        [placeholder]="placeholder"
        [readonly]="readonly"
      >
      </textarea>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosInputTextAreaDemoComponent {
  @Input() value: string;
  @Input() showLabel: string;
  @Input() label: string;
  @Input() errors: string;
  @Input() style: string;
  @Input() placeholder: string;
  @Input() readonly: boolean;
  @Input() disabled: boolean;
}
