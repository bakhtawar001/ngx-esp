import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { CosPillModule } from '@cosmos/components/pill';

@Component({
  selector: 'esp-project-in-hands-date-pill',
  templateUrl: './project-in-hands-date-pill.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectInHandsDatePillComponent {
  @Input()
  isInHandsDateFlexible: boolean | undefined = undefined;
}

@NgModule({
  imports: [CommonModule, CosPillModule],
  declarations: [ProjectInHandsDatePillComponent],
  exports: [ProjectInHandsDatePillComponent],
})
export class ProjectInHandsDatePillModule {}
