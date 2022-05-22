import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosChartDemoModule } from './chart-demo.module';
import markdown from './charts.md';

@Component({
  selector: 'cos-chart-demo-component',
  template: `<div class="cos-chart-container">
    <cos-chart-demo></cos-chart-demo>
  </div>`,
})
class CosDemoComponent {}

export default {
  title: 'Charts/Chart',
  parameters: {
    notes: markdown,
  },
};

export const primary = (props) => ({
  moduleMetadata: {
    declarations: [CosDemoComponent],
    imports: [BrowserAnimationsModule, CosChartDemoModule],
  },
  component: CosDemoComponent,
  props,
});
