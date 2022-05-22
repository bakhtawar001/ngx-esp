import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import markdown from './pagination.md';
import { CosPaginationModule } from './pagination.module';

@Component({
  selector: 'cos-pagination-demo',
  template: `
    <cos-pagination
      [length]="63606"
      [pageSize]="30"
      [maxPageNumbers]="12"
      [variant]="variant"
    ></cos-pagination>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosPaginationDemoComponent {}

export default {
  title: 'Navigation/Pagination',

  parameters: {
    notes: markdown,
  },
};

export const primary = () => ({
  moduleMetadata: {
    declarations: [CosPaginationDemoComponent],
    imports: [BrowserAnimationsModule, CosPaginationModule],
  },
  component: CosPaginationDemoComponent,
});

export const small = () => ({
  moduleMetadata: {
    declarations: [CosPaginationDemoComponent],
    imports: [BrowserAnimationsModule, CosPaginationModule],
  },
  component: CosPaginationDemoComponent,
  props: {
    variant: 'small',
  },
});
