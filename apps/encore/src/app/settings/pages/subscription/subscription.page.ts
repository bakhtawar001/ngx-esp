import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosNotificationModule } from '@cosmos/components/notification';
import { CosPillModule } from '@cosmos/components/pill';
import { CosRadioModule } from '@cosmos/components/radio';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage {
  subscriptionForm = this.createForm();

  automaticPaymentOptions = ['Enabled', 'Disabled'];

  notificationTitle = 'Credit card expiring soon';
  notificationBody =
    'A credit card on file is expiring within the next 30 days.';

  pageDescription =
    'Quis nostrud exercitation ullamco laboris nisi ut aliquip tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur labore et dolore magna adipiscing elit, sed do.';

  constructor(private _fb: FormBuilder) {}

  trackByFn(index) {
    return index;
  }

  protected createForm() {
    return this._fb.group({
      automaticPaymentOption: ['enabled'],
    });
  }
}

@NgModule({
  declarations: [SubscriptionPage],
  imports: [
    CommonModule,
    CosSegmentedPanelModule,
    AsiPanelEditableRowModule,
    CosNotificationModule,
    CosButtonModule,
    CosPillModule,
    CosRadioModule,
    ReactiveFormsModule,
  ],
})
export class SubscriptionPageModule {}
