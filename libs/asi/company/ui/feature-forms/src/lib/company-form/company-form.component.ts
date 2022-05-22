import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CompanyFormModel } from '@asi/company/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { AsiCompanyInfoFormComponentModule } from '../company-info-form';
import { FormGroupComponent } from '@cosmos/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AsiCompanyBrandInformationFormModule } from '../company-brand-information-form';

@UntilDestroy()
@Component({
  selector: 'asi-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiCompanyFormComponent extends FormGroupComponent<CompanyFormModel> {
  @Input() companyType?: string;
  @Input() isPreselectedCompanyType = false;

  showBrandInfo = false;

  toggleBrandInfo(): void {
    this.showBrandInfo = !this.showBrandInfo;
  }
}

@NgModule({
  declarations: [AsiCompanyFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosButtonModule,

    AsiCompanyBrandInformationFormModule,
    AsiCompanyInfoFormComponentModule,
  ],
  exports: [AsiCompanyFormComponent],
})
export class AsiCompanyFormComponentModule {}
