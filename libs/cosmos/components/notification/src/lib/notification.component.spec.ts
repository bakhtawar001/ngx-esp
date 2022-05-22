import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { CosNotificationComponent } from './notification.component';
import { CosNotificationModule } from './notification.module';

const template = `
    <cos-notification [type]="type" id="testNotification">
      <cos-notification-icon class="cos-test" *ngIf="showCustomIcon"
        ><div><i class="fa fa-dog"></i></div
      ></cos-notification-icon>
      <cos-notification-title>{{ title }}</cos-notification-title>
      <cos-notification-body>{{ body }}</cos-notification-body>
    </cos-notification>
  `;

describe('CosNotificationComponent', () => {
  let component: CosNotificationComponent;
  let spectator: SpectatorHost<CosNotificationComponent>;

  const createHost = createHostFactory({
    component: CosNotificationComponent,
    imports: [CosNotificationModule],
  });

  beforeEach(() => {
    spectator = createHost(template);
    component = spectator.component;
  });

  it('should render correctly', () => {
    expect(spectator.queryHost('.cos-notification')).toBeTruthy();
  });
});
