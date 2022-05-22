import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'cos-notification-icon',
  template: `<ng-content></ng-content>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosNotificationIconComponent {}

@Component({
  selector: 'cos-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-notification',
    '[attr.type]': 'type',
    '[attr.role]': 'alert',
    '[attr.aria-atomic]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosNotificationComponent {
  @Input() type = 'inline';
  @Input() title?: string;
  @Input() body?: string;
  @Input() isToast = false;

  @ContentChild(CosNotificationIconComponent)
  iconChild!: CosNotificationIconComponent;
}

@Component({
  selector: 'cos-notification-title',
  template: `<div class="cos-notification-title">
    <ng-content></ng-content>
  </div>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosNotificationTitleComponent {}

@Component({
  selector: 'cos-notification-body',
  template: `<div class="cos-notification-body">
    <ng-content></ng-content>
  </div>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosNotificationBodyComponent {}
