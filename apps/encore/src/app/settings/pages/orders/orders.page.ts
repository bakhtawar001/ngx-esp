import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosInputModule } from '@cosmos/components/input';
import { CosRadioModule } from '@cosmos/components/radio';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { HasRolePipeModule } from '@esp/auth';
import { QuillModule } from 'ngx-quill';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage {
  orderCreationForm = this.createForm();
  allowOverrides = true;
  shippingMethodAllowOverrides = true;
  useCompanyLogo = true;
  errors = false;
  orderContact = false;
  orderPayments = true;
  orderTracking = false;

  displayCheckboxes = [
    'Show Product Images',
    'Show Shipping Contact Phone Number',
    'Show Shipping Contact Email Address',
    'Show PO Reference',
  ];

  displayOptions = ['Show CPN', 'Show Product Number'];

  contactOptions = [
    'Order Creator',
    'Customer record owner',
    'Selected other user',
  ];

  trackByFn(index) {
    return index;
  }

  constructor(private _fb: FormBuilder) {}

  updateValue(key) {
    console.log(key);
  }

  orderContactChange(event) {
    this.orderContact = event.checked;
  }

  protected createForm() {
    return this._fb.group({
      email: [''],
      name: [''],
      prefix: ['abc'],
      suffix: ['xyz'],
      startingNumber: ['1009'],
      defaultSalesPerson: ['Order Creator'],
      carrier: ['UPS'],
      shippingMethod: ['2 Day Shipping'],
      paymentTerms: ['Net 60'],
      paymentMethod: ['Credit Card'],
      documentHeader: [
        '<p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIUAAAAkBAMAAABVtOREAAAAG1BMVEXMzMyWlpacnJy3t7ejo6O+vr6qqqrFxcWxsbEkmh52AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAoElEQVRIie2RPwvCMBBHfxrzZ5Si4Bio0o5W1Dkd3IP0A7S4dIwg2LH6yT07uSbgdm95l+Vx5ACGYZgf5uhyle2nmay2ITohaumujbTTg3w2bXRDVjocnsLCjDeQL4jfAzMs1qg9kDuQy1VSA28YC1TUMXYzuISG8PeTXgIvD3LxHaMb0h0b4aB3FuTepOyBrlBZgBp7um14pPwHwzB/4QOinBTNDjXkqwAAAABJRU5ErkJggg=="></p><p>Greetings, this is a placeholder header</p>',
      ],
      documentFooter: ['<p>Greetings, this is a placeholder footer</p>'],
      currentDisplayOption: ['Show CPN'],
      currentContactOption: ['Order Creator'],
      showProductImages: [true],
      showShippingContactPhoneNumber: [false],
      showShippingContactEmailAddress: [false],
      showPoRefernence: [false],
    });
  }
}

@NgModule({
  declarations: [OrdersPage],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    QuillModule,

    CosInputModule,
    CosRadioModule,
    CosSegmentedPanelModule,
    CosSlideToggleModule,

    HasRolePipeModule,

    AsiPanelEditableRowModule,
  ],
})
export class OrdersPageModule {}
