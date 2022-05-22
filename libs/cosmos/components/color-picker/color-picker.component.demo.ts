import { Component } from '@angular/core';

@Component({
  selector: 'cos-color-picker-demo-component',
  styleUrls: ['./color-picker.scss'],
  template: `
    <label
      ><strong>Select a color</strong>
      <div class="color-picker-container">
        <div class="colorblock" [style.background]="color"></div>
        <input [(colorPicker)]="color" [value]="color" /></div
    ></label>
  `,
})
export class CosColorPickerDemoComponent {
  public color = '#fff';
}
