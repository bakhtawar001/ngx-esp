import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import data from './dropdown-filters.data.json';

@Component({
  selector: 'cos-demo-component',
  template: `
    <cos-dropdown-filter
      [data]="data"
      [labelText]="label"
      [placeholderText]="placeholder"
      (checkboxStateChange)="checkboxChange($event)"
    >
    </cos-dropdown-filter>
    <div *ngIf="changeText">
      <strong>Example Event output:</strong>
      <br />
      {{ changeText }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosDropdownFilterDemoComponent {
  @Input()
  data = data.Categories;

  @Input()
  label = 'Categories';

  @Input()
  placeholder = 'Search';

  @Input()
  changeText = '';

  checkboxChange(checkbox: any) {
    console.log(checkbox);
    this.changeText = `Id: ${checkbox.Id}, Checked: ${checkbox.checked}`;
  }
}
