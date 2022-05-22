import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosButtonModule } from '@cosmos/components/button';
import { arg } from '@cosmos/storybook';
import { NgxsModule } from '@ngxs/store';
import markdown from './notification.md';
import { CosNotificationModule } from './notification.module';
import { CosToastService } from './services';
import { HotToastComponent } from './services/lazy-hot-toast';

@Component({
  selector: 'cos-demo-component',
  styleUrls: ['./notification-demo.scss'],
  template: `
    <cos-notification [type]="type">
      <cos-notification-icon class="cos-test" *ngIf="showCustomIcon"
        ><div><i class="fa fa-dog"></i></div
      ></cos-notification-icon>
      <cos-notification-title>{{ title }}</cos-notification-title>
      <cos-notification-body>{{ body }}</cos-notification-body>
      <div *ngIf="showButtons">
        <button cos-flat-button (click)="testClick($event)">
          Update Credit Card
        </button>
        <button cos-flat-button [color]="'primary'" (click)="testClick($event)">
          Continue Anyway
        </button>
      </div>
    </cos-notification>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosDemoComponent {
  @Input() type: string;
  @Input() title: string;
  @Input() body: string;
  @Input() showButtons: boolean;
  @Input() showCustomIcon: boolean;

  testClick() {
    console.log('Button was clicked');
  }
}

@Component({
  selector: 'cos-toast-demo-component',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosToastDemoComponent implements OnChanges {
  @Input() type!: 'confirm' | 'error' | 'info' | 'warn';
  @Input() title?: string;
  @Input() body?: string;
  @Input() duration?: number;
  @Input() autoClose?: boolean;
  @Input() dismissable?: boolean;

  constructor(private toast: CosToastService) {}

  ngOnChanges() {
    this.toast.showToast(
      { title: this.title, body: this.body, type: this.type },
      {
        duration: this.duration,
        position: 'bottom-right',
        autoClose: this.autoClose,
        dismissible: this.dismissable,
      }
    );
  }
}

export default {
  title: 'Composites/Notification',
  parameters: {
    notes: markdown,
  },
  args: {
    type: 'info',
    title: 'Title',
    body: 'This is an example of content in the body.',
    duration: 5000,
    autoClose: true,
    dismissable: false,
  },
  argTypes: {
    type: {
      name: 'Type',
      options: ['info', 'warn', 'error', 'confirm'],
      control: 'select',
    },
    title: arg('Title'),
    body: arg('Content'),
    showButtons: arg('Show buttons', 'boolean'),
    showCustomIcon: arg('Show custom icon', 'boolean'),
    duration: arg('Duration', 'number'),
    autoClose: arg('Auto close', 'boolean'),
    dismissable: arg('Dismissable', 'boolean'),
  },
};

export const inline = (props: any) => ({
  moduleMetadata: {
    declarations: [CosDemoComponent],
    imports: [BrowserAnimationsModule, CosNotificationModule, CosButtonModule],
  },
  component: CosDemoComponent,
  props,
});

export const toast = (props: any) => ({
  moduleMetadata: {
    declarations: [CosToastDemoComponent],
    imports: [
      BrowserAnimationsModule,
      CosNotificationModule,
      NgxsModule.forRoot(),
    ],
    entryComponents: [HotToastComponent],
  },
  component: CosToastDemoComponent,
  props,
});
