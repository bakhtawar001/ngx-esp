import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-accordion-demo-component',
  template: `
    <cos-accordion
      [expanded]="expanded"
      [size]="size"
      [hideToggle]="hideToggle"
      [disabled]="disabled"
    >
      <cos-accordion-header>{{ accordionTitle }}</cos-accordion-header>
      <p>Veniam dolor sit sint cupidatat fugiat nulla ad sit cillum.</p>
    </cos-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosAccordionDemoComponent {
  @Input() accordionTitle?: string;
  @Input() size?: string;
  @Input() expanded?: boolean;
  @Input() disabled?: boolean;
  @Input() hideToggle?: boolean;
}
