import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import markdown from './tracker.md';
import { CosTrackerModule } from './tracker.module';

@Component({
  selector: 'cos-demo-component',
  styleUrls: ['tracker-demo.scss'],
  template: `
    <div class="cos-tooltip-demo-container">
      <cos-tracker [startsOnZero]="startOnZeroStep" [currentStep]="currentStep">
        <cos-tracker-step color="green" [size]="size"
          ><i class="fa fa-check cos-text--white"></i
        ></cos-tracker-step>
        <cos-tracker-step color="yellow" [size]="size"
          ><i
            matTooltip="There is an alert here!"
            matTooltipPosition="below"
            matTooltipHideDelay="100"
            class="fa fa-exclamation-triangle cos-text--white"
          ></i
        ></cos-tracker-step>
        <cos-tracker-step [size]="size"
          ><span *ngIf="showNumbers">3</span></cos-tracker-step
        >
        <cos-tracker-step [size]="size"
          ><span *ngIf="showNumbers">4</span></cos-tracker-step
        >
        <cos-tracker-step [size]="size"
          ><span *ngIf="showNumbers">5</span></cos-tracker-step
        >
      </cos-tracker>
    </div>
    <div class="cos-tracker-1-container cos-tooltip-demo-container">
      <cos-tracker [startsOnZero]="startOnZeroStep" [currentStep]="currentStep">
        <cos-tracker-step color="green" [size]="size"
          ><i class="fa fa-check cos-text--white"></i
        ></cos-tracker-step>
        <cos-tracker-step color="yellow" [size]="size"
          ><i
            matTooltip="There is an alert here!"
            matTooltipPosition="below"
            matTooltipHideDelay="100"
            class="fa fa-exclamation-triangle cos-text--white"
          ></i
        ></cos-tracker-step>
        <cos-tracker-step [size]="size"
          ><span *ngIf="showNumbers">3</span></cos-tracker-step
        >
        <cos-tracker-step [size]="size"
          ><span *ngIf="showNumbers">4</span></cos-tracker-step
        >
      </cos-tracker>
    </div>
    <div class="cos-tracker-2-container cos-tooltip-demo-container">
      <cos-tracker [startsOnZero]="startOnZeroStep" [currentStep]="currentStep">
        <cos-tracker-step color="green" [size]="size"
          ><i class="fa fa-check cos-text--white"></i
        ></cos-tracker-step>
        <cos-tracker-step color="yellow" [size]="size"
          ><i
            matTooltip="There is an alert here!"
            matTooltipPosition="below"
            matTooltipHideDelay="100"
            class="fa fa-exclamation-triangle cos-text--white"
          ></i
        ></cos-tracker-step>
        <cos-tracker-step [size]="size"
          ><span *ngIf="showNumbers">3</span></cos-tracker-step
        >
      </cos-tracker>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosDemoComponent {
  @Input() currentStep: number;
  @Input() startOnZeroStep: boolean;
  @Input() showNumbers: boolean;
  @Input() size: string;

  @Input() additionalSteps;

  get steps() {
    return Array(this.additionalSteps);
  }
}

export default {
  title: 'Layout Examples/Multiple Horizontal Trackers',
  parameters: {
    notes: markdown,
  },
  args: {
    currentStep: 2,
    showNumbers: true,
  },
  argTypes: {
    currentStep: {
      name: 'Current Step',
      control: 'number',
    },
    startOnZeroStep: {
      name: 'Starts on Zero',
      control: 'boolean',
    },
    showNumbers: {
      name: 'Show Numbers',
      control: 'boolean',
    },
    size: {
      name: 'Size',
      options: ['Default', 'lg'],
      control: {
        type: 'select',
        labels: {
          lg: 'Large',
        },
      },
    },
  },
};

export const primary = (props) => ({
  moduleMetadata: {
    declarations: [CosDemoComponent],
    imports: [BrowserAnimationsModule, CosTrackerModule, MatTooltipModule],
  },
  component: CosDemoComponent,
  props,
});
