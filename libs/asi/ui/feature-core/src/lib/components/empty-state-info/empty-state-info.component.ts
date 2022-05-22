import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  Directive,
} from '@angular/core';

@Directive({
  selector: '[asiEmptyStateInfoButtons]',
})
export class AsiEmptyStateInfoButtonsDirective {}

@Component({
  selector: 'asi-empty-state-info',
  templateUrl: './empty-state-info.component.html',
  styleUrls: ['./empty-state-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiEmptyStateInfoComponent {
  @Input()
  mainText = '';
  @Input()
  secondText = '';
  @Input()
  thirdText = '';
}

@NgModule({
  imports: [CommonModule],
  declarations: [AsiEmptyStateInfoComponent, AsiEmptyStateInfoButtonsDirective],
  exports: [AsiEmptyStateInfoComponent, AsiEmptyStateInfoButtonsDirective],
})
export class AsiEmptyStateInfoModule {}
