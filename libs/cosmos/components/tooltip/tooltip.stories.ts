import { Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosButtonModule } from '@cosmos/components/button';
import markdown from './tooltip.md';

@Component({
  selector: 'cos-demo-component',
  styleUrls: ['./tooltip-demo.scss'],
  template: `
    <div class="cos-tooltip-demo-container">
      <button
        cos-icon-button
        matTooltip="Info about the action"
        [matTooltipPosition]="pos"
        matTooltipHideDelay="100"
        aria-label="Button that displays a tooltip that hides when scrolled out of the container"
      >
        <i class="fas fa-info-circle cos-text--blue"></i>
      </button>
    </div>
  `,
})
class CosDemoComponent {
  @Input() pos: string;
}

export default {
  title: 'Overlays/Tooltip',
  parameters: {
    notes: markdown,
  },
  args: {
    pos: 'above',
  },
  argTypes: {
    pos: {
      name: 'Tooltip Position',
      options: ['above', 'below', 'left', 'right'],
      control: { type: 'select' },
    },
  },
};

export const primary = (props) => ({
  moduleMetadata: {
    declarations: [CosDemoComponent],
    imports: [BrowserAnimationsModule, MatTooltipModule, CosButtonModule],
  },
  component: CosDemoComponent,
  props,
});
