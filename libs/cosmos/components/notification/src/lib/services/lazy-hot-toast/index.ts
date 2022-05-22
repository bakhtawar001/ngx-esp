/**
 * This file serves as a separate Webpack entry point that bundles `@ngneat/hot-toast`.
 * The `@ngneat/hot-toast` package is not bundled within the main bundle, and it'll be
 * lazy-loaded in the future when the first notification is shown.
 *
 * Do not reference this file directly, the below types are re-exported through the type export `export type { ... }`.
 */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  NgModule,
  Type,
} from '@angular/core';
import { HotToastRef, ToastPosition } from '@ngneat/hot-toast';

import { TOAST_COMPONENT_DATA } from '../toast.service';
import { CosNotificationModule } from '../../notification.module';

export type ToastType = 'confirm' | 'error' | 'info' | 'warn';

export interface ToastData {
  title?: string;
  body?: string;
  type: ToastType;
  component?: Type<any>;
  componentData?: Record<string, unknown>;
}

export interface ToastConfig {
  duration?: number;
  position?: ToastPosition;
  className?: string;
  autoClose?: boolean;
  dismissible?: boolean;
}

@Component({
  selector: 'cos-hot-toast-component',
  template: `
    <cos-notification [type]="toastRef.data.type">
      <cos-notification-title>{{ toastRef.data.title }}</cos-notification-title>
      <cos-notification-body>
        <div class="hot-toast-body">
          <div>{{ toastRef.data.body }}</div>
          <div *ngIf="toastRef.data.component">
            <ng-template
              [ngComponentOutlet]="toastRef.data.component"
              [ngComponentOutletInjector]="ngComponentOutletInjector"
            ></ng-template>
          </div>
        </div>
      </cos-notification-body>
    </cos-notification>
  `,
  styles: [
    `
      .hot-toast-body {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotToastComponent {
  ngComponentOutletInjector: Injector;

  constructor(
    parent: Injector,
    @Inject(HotToastRef) public toastRef: HotToastRef<ToastData>
  ) {
    this.ngComponentOutletInjector = Injector.create({
      parent,
      providers: [
        {
          provide: TOAST_COMPONENT_DATA,
          useValue: toastRef.data.componentData,
        },
      ],
    });
  }
}

// We have to have this module since it serves as a compilation unit for the `HotToastComponent`.
@NgModule({
  imports: [CommonModule, CosNotificationModule],
  declarations: [HotToastComponent],
})
export class HotToastModule {}

export { HotToastService } from '@ngneat/hot-toast';
