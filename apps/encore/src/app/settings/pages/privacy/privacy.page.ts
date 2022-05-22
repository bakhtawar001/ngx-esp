import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosButtonGroupModule } from '@cosmos/components/button-group';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { CosSlideToggleModule } from '@cosmos/components/toggle';

@Component({
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPage {
  public privacyForm = this.createForm();

  toggleOptions = [
    { name: 'Public', value: 'public', disabled: false },
    { name: 'Private', value: 'private', disabled: false },
  ];

  errors = false;
  canEdit = false;
  autoCalculation = false;

  constructor(private _fb: FormBuilder) {}

  buttonGroupSelection(value) {
    console.log(value);
  }

  protected createForm() {
    // const URL_REGEXP = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;

    return this._fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      website: [''],
      primary_brand_color: [''],
    });
  }

  updateValue(id: string) {
    console.log(id);
  }
}

@NgModule({
  declarations: [PrivacyPage],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosButtonGroupModule,
    CosSegmentedPanelModule,
    CosSlideToggleModule,

    AsiPanelEditableRowModule,
  ],
})
export class PrivacyPageModule {}
