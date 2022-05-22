import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  selector: 'esp-project-detail-notifications',
  templateUrl: './project-detail-notifications.component.html',
  styleUrls: ['./project-detail-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailNotificationsComponent {
  @Input()
  tasksNumber = 0;
  @Input()
  tasksEnabled = false;
  @Input()
  alertsNumber = 0;
  @Input()
  alertsEnabled = false;
  @Input()
  messagesNumber = 0;
  @Input()
  messagesEnabled = false;
}

@NgModule({
  declarations: [ProjectDetailNotificationsComponent],
  exports: [ProjectDetailNotificationsComponent],
  imports: [CommonModule],
})
export class ProjectDetailNotificationsModule {}
