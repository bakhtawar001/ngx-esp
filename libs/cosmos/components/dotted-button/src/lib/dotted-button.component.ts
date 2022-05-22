import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cos-dotted-button',
  templateUrl: 'dotted-button.component.html',
  styleUrls: ['dotted-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosDottedButtonComponent {
  @Input() title!: string;
}

@NgModule({
  declarations: [CosDottedButtonComponent],
  imports: [CommonModule],
  exports: [CosDottedButtonComponent],
})
export class CosDottedButtonModule {}
