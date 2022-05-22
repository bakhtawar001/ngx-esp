import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CosRadioChange } from './radio.component';

@Component({
  selector: 'cos-radio-demo-component',
  template: `
    <div style="max-width: 500px;">
      <label
        for="test-radio"
        class="cos-form-label"
        id="example-radio-group-label"
      >
        Pick your favorite animal
      </label>
      <div
        cosRadioGroup
        id="test-radio"
        (change)="changeEvent($event)"
        aria-label="Select an option"
        [(ngModel)]="selectedAnimal"
        [size]="size"
        [disabled]="disabled"
        [required]="required"
        [labelPosition]="labelPosition"
        aria-labelledby="example-radio-group-label"
      >
        <cos-radio-button
          *ngFor="let animal of animals; trackBy: trackByFn"
          [value]="animal"
          [disabled]="disabled"
          >{{ animal }}</cos-radio-button
        >
      </div>

      <p>The currently selected animal is {{ selectedAnimal }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosRadioDemoComponent {
  @Input() labelPosition!: 'before' | 'after';
  @Input() size!: string;
  @Input() disabled = false;
  selectedAnimal = 'cat';
  animals: string[] = ['dog', 'cat'];

  trackByFn(index: number) {
    return index;
  }

  changeEvent(event: CosRadioChange) {
    //console.log('Current Checked State: ', event.value);
  }
}
