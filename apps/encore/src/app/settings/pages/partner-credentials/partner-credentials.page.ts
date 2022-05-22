import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { CosSlideToggleModule } from '@cosmos/components/toggle';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  templateUrl: './partner-credentials.page.html',
  styleUrls: ['./partner-credentials.page.scss'],
})
export class PartnerCredentialsPage {
  partnerCredentialsForm = this.createForm();

  pageDescription =
    'Quis nostrud exercitation ullamco laboris nis ut aliquip tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur labore et dolore magna adipiscing elit, sed do.';

  errors = false;

  isAddingNewMembership = false;

  constructor(private _fb: FormBuilder) {}

  protected createForm() {
    return this._fb.group({
      email: [''],
      name: [''],
      username: [''],
      password: [''],
      allowUserOverrides: [true],
      accountNumber: ['423523554734'],
      carrier: ['UPS'],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateValue(value) {}

  addMembership() {
    this.isAddingNewMembership = !this.isAddingNewMembership;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  saveNewMembership() {}
}

@NgModule({
  declarations: [PartnerCredentialsPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AsiPanelEditableRowModule,
    CosButtonModule,
    CosInputModule,
    CosFormFieldModule,
    CosSegmentedPanelModule,
    CosSlideToggleModule,
  ],
})
export class PartnerCredentialsPageModule {}
