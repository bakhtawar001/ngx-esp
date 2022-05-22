import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosAvatarListModule } from '@cosmos/components/avatar-list';
import { CosButtonModule } from '@cosmos/components/button';
import { CosButtonGroupModule } from '@cosmos/components/button-group';
import { CosInputModule } from '@cosmos/components/input';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { CosSlideToggleModule } from '@cosmos/components/toggle';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  templateUrl: './accounting-integrations.page.html',
  styleUrls: ['./accounting-integrations.page.scss'],
})
export class AccountingIntegrationsPage {
  accountingIntegrationsForm = this.createForm();

  constructor(private _fb: FormBuilder) {}

  pageDescription =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.';

  quickBookMapOptions = [
    { name: 'Product Number', value: 'productNumber', disabled: false },
    { name: 'Product Name', value: 'productName', disabled: false },
  ];

  // Toggle these to see the various UI state changes
  integrations = {
    quickbooks: {
      installed: false,
      active: true,
      authenticated: false,
    },
  };

  showMore = false;
  quickBooksActive = true;
  setCustomerAsBillable = true;
  quickBooksAuthenticated = true;

  avatars = [
    {
      displayText: 'DL',
      imgUrl:
        'https://www.gravatar.com/avatar/bff5129d165d4ca9a65991795c1a18f1?d=404',
      toolTipText: 'Devon Lehman',
    },
    {
      displayText: 'RC',
      imgUrl:
        'https://www.gravatar.com/avatar/bff5129d165d4ca9a65991795c1a18f1?d=404',
      toolTipText: 'Ravi Chavalam',
    },
    {
      displayText: 'RY',
      imgUrl:
        'https://www.gravatar.com/avatar/bff5129d165d4ca9a65991795c1a18f1?d=404',
      toolTipText: 'Ryan',
    },
    {
      displayText: 'DN',
      imgUrl:
        'https://www.gravatar.com/avatar/bff5129d165d4ca9a65991795c1a18f1?d=404',
      toolTipText: 'Danish',
    },
    {
      displayText: 'RI',
      imgUrl:
        'https://www.gravatar.com/avatar/bff5129d165d4ca9a65991795c1a18f1?d=404',
      toolTipText: 'Rifat',
    },
  ];

  errors = false;

  quickBookMapGroupSelection(event) {
    console.log(event);
  }

  reAuth() {
    this.quickBooksAuthenticated = false;
  }

  showMoreToggle() {
    this.showMore = !this.showMore;
  }

  protected createForm() {
    return this._fb.group({
      name: [''],
      email: [''],
      phone: [''],
    });
  }
}

@NgModule({
  declarations: [AccountingIntegrationsPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CosAvatarListModule,
    CosButtonModule,
    CosButtonGroupModule,
    CosInputModule,
    CosSegmentedPanelModule,
    CosSlideToggleModule,

    AsiPanelEditableRowModule,
  ],
})
export class AccountingIntegrationsPageModule {}
