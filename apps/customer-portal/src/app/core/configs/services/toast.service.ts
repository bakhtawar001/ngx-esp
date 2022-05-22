import { Component, Inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

@Component({
  selector: 'esp-toast-component',
  template: `
    <cos-notification [type]="data.type" [isToast]="true">
      <cos-notification-title>{{ data.title }}</cos-notification-title>
      <cos-notification-body>{{ data.body }}</cos-notification-body>
    </cos-notification>
  `,
})
export class ToastComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}

export interface ToastConfig extends MatSnackBarConfig {
  horizontalPosition?: MatSnackBarHorizontalPosition;
  verticalPosition?: MatSnackBarVerticalPosition;
  duration?: number;
}

const defaultConfig: ToastConfig = {
  horizontalPosition: 'right',
  verticalPosition: 'bottom',
  duration: 3000,
};

@Injectable()
export class ToastService {
  constructor(private _snackBar: MatSnackBar) {}

  success(title: string, body: string, config?: ToastConfig) {
    this.showToast(title, body, 'confirm', config);
  }

  error(title: string, body: string, config?: ToastConfig) {
    this.showToast(title, body, 'error', config);
  }

  info(title: string, body: string, config?: ToastConfig) {
    this.showToast(title, body, 'info', config);
  }

  warning(title: string, body: string, config?: ToastConfig) {
    this.showToast(title, body, 'warn', config);
  }

  showToast(
    title: string,
    body: string,
    type: string = 'info',
    config: ToastConfig = defaultConfig
  ) {
    this._snackBar.openFromComponent(ToastComponent, {
      data: {
        type,
        title,
        body,
      },
      ...{ ...defaultConfig, ...config },
    });
  }
}
