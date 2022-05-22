import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CosButtonModule } from '@cosmos/components/button';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { FormGroupComponent } from '@cosmos/forms';
import { BrandInformation } from '@esp/models';
import {
  EspBrandColorFormModule,
  EspImageUploadFormModule,
} from '@esp/settings';
import { ColorPickerService } from 'ngx-color-picker';

@Component({
  selector: 'asi-company-brand-information-form',
  templateUrl: './company-brand-information-form.component.html',
  styleUrls: ['./company-brand-information-form.component.scss'],
  providers: [ColorPickerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiCompanyBrandInformationFormComponent extends FormGroupComponent<BrandInformation> {
  iconMediaLinkConfig = {
    width: '64px',
    height: '64px',
    maxFileBytes: 2097152,
  };

  logoMediaLinkConfig = {
    width: '200px',
    height: '200px',
    maxFileBytes: 10485760,
  };
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosFormFieldModule,
    CosInputModule,

    CosButtonModule,
    EspBrandColorFormModule,
    EspImageUploadFormModule,
  ],
  declarations: [AsiCompanyBrandInformationFormComponent],
  exports: [AsiCompanyBrandInformationFormComponent],
})
export class AsiCompanyBrandInformationFormModule {}
