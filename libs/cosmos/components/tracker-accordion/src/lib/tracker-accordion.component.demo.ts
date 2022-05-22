import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-tracker-accordion-demo-component',
  template: `
    <cos-tracker-accordion
      accordionTitle="Negotiation & Pitching"
      [expanded]="expanded"
      [expandable]="expandable"
      [size]="size"
      [hideToggle]="hideToggle"
      [disabled]="disabled"
      status="complete"
    >
      <cos-tracker-accordion-label>1</cos-tracker-accordion-label>
      <p>Veniam dolor sit sint cupidatat fugiat nulla ad sit cillum.</p>
    </cos-tracker-accordion>
    <cos-tracker-accordion
      accordionTitle="Quoting"
      [expanded]="expanded"
      [expandable]="expandable"
      [size]="size"
      [hideToggle]="hideToggle"
      [disabled]="disabled"
      status="complete"
    >
      <cos-tracker-accordion-label>2</cos-tracker-accordion-label>
      <p>Veniam dolor sit sint cupidatat fugiat nulla ad sit cillum.</p>
    </cos-tracker-accordion>
    <cos-tracker-accordion
      accordionTitle="Ordering"
      [expanded]="expanded"
      [expandable]="expandable"
      [size]="size"
      [hideToggle]="hideToggle"
      [disabled]="disabled"
      status="complete"
    >
      <cos-tracker-accordion-label>3</cos-tracker-accordion-label>
      <p>Veniam dolor sit sint cupidatat fugiat nulla ad sit cillum.</p>
    </cos-tracker-accordion>
    <cos-tracker-accordion
      accordionTitle="Fullfillment"
      [expanded]="expanded"
      [expandable]="expandable"
      [size]="size"
      [hideToggle]="hideToggle"
      [disabled]="disabled"
      status="warn"
    >
      <cos-tracker-accordion-label
        ><i class="fa fa-exclamation-triangle cos-text--white"></i
      ></cos-tracker-accordion-label>
      <p>Veniam dolor sit sint cupidatat fugiat nulla ad sit cillum.</p>
    </cos-tracker-accordion>
    <cos-tracker-accordion
      accordionTitle="Complete"
      [expanded]="expanded"
      [expandable]="expandable"
      [size]="size"
      [hideToggle]="hideToggle"
      [disabled]="disabled"
    >
      <cos-tracker-accordion-label>5</cos-tracker-accordion-label>
      <p>Veniam dolor sit sint cupidatat fugiat nulla ad sit cillum.</p>
    </cos-tracker-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosTrackerAccordionDemoComponent {
  @Input() size: string;
  @Input() expandable: boolean;
  @Input() expanded: boolean;
  @Input() hideToggle: boolean;
  @Input() disabled: boolean;
}
