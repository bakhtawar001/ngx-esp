import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-toggle-demo-component',
  template: `
    <cos-toggle
      [id]="id"
      [name]="name"
      [size]="size"
      [required]="required"
      [aria-labelledby]="ariaLabelledBy"
      [aria-label]="ariaLabel"
      [labelPosition]="labelPosition"
      [checked]="checked"
      [disabled]="disabled"
      (change)="changeEvent($event)"
      (toggleChange)="toggleChangeEvent($event)"
    >
      {{ labelText }}
    </cos-toggle>
    <div>
      <p>The toggle is set to: {{ checkedState }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosSlideToggleDemoComponent {
  checkedState = false;

  @Input() labelText: string;
  @Input() disabled;
  @Input() checked;
  @Input() required;
  @Input() size;
  @Input() labelPosition: 'before' | 'after' = 'after';

  changeEvent(event) {
    this.checkedState = event.checked;
  }

  toggleChangeEvent(event) {
    console.log(event);
  }
}
