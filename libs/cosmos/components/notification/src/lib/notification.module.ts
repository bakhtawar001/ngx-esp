import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  CosNotificationBodyComponent,
  CosNotificationComponent,
  CosNotificationIconComponent,
  CosNotificationTitleComponent,
} from './notification.component';

@NgModule({
  imports: [CommonModule, MatSnackBarModule],
  exports: [
    CosNotificationComponent,
    CosNotificationTitleComponent,
    CosNotificationBodyComponent,
    CosNotificationIconComponent,
  ],
  declarations: [
    CosNotificationComponent,
    CosNotificationTitleComponent,
    CosNotificationBodyComponent,
    CosNotificationIconComponent,
  ],
})
export class CosNotificationModule {}
