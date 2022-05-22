import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  NotificationsPage,
  NotificationsPageModule,
} from './notifications.page';

describe('NotificationsPage', () => {
  let spectator: Spectator<NotificationsPage>;
  let component: NotificationsPage;

  const createComponent = createComponentFactory({
    component: NotificationsPage,
    imports: [NotificationsPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
