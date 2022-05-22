import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { CosCardModule } from '@cosmos/components/card';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCardComponent {}

@NgModule({
  declarations: [NotificationCardComponent],
  imports: [CommonModule, CosCardModule],
  exports: [NotificationCardComponent],
})
export class NotificationCardModule {}
