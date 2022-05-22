import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CosTrackerStepComponent } from './tracker-step.component';
import { CosTrackerComponent } from './tracker.component';

@NgModule({
  declarations: [CosTrackerComponent, CosTrackerStepComponent],
  imports: [CommonModule],
  exports: [CosTrackerComponent, CosTrackerStepComponent],
})
export class CosTrackerModule {}
