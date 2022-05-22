import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { CosTrackerStepComponent } from './tracker-step.component';

@Component({
  selector: 'cos-tracker',
  templateUrl: 'tracker.component.html',
  styleUrls: ['tracker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-tracker',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosTrackerComponent {
  steps: CosTrackerStepComponent[] = [];
  @Input() currentStep = 0;
  @Input() startsOnZero = false;

  get _percentage() {
    if (this.startsOnZero) {
      return this.currentStep <= this.steps.length - 1
        ? (100 / (this.steps.length - 1)) * this.currentStep
        : 100;
    } else {
      return this.currentStep <= this.steps.length
        ? (100 / (this.steps.length - 1)) * (this.currentStep - 1)
        : 100;
    }
  }

  addStep(step: CosTrackerStepComponent) {
    step.index = this.steps.length;
    this.steps.push(step);
  }
}
