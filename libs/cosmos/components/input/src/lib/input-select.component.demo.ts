import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-select-demo-component',
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
      <select
        matNativeControl
        id="demo"
        [style]="style"
        [(ngModel)]="value"
        [attr.disabled]="disabled ? '' : null"
      >
        <option value="1">Apples</option>
        <option value="2">Bananas</option>
        <option value="3">Grapes</option>
        <option value="4">Oranges</option>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosSelectDemoComponent {
  @Input() value: string;
  @Input() showLabel: string;
  @Input() label: string;
  @Input() error: boolean;
  @Input() style: string;
  @Input() disabled: boolean;
}
