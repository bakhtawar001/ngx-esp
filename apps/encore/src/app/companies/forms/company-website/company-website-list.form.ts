import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidateUrl } from '@cosmos/common';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosInputModule } from '@cosmos/components/input';
import { CosInputRowModule } from '@cosmos/components/input-row';
import { FormArrayComponent, FormGroup } from '@cosmos/forms';
import { Website, WebsiteTypeEnum } from '@esp/models';
import { CompanyWebsiteValidator } from './company-website.validator';

@Component({
  selector: 'esp-company-website-list-form',
  templateUrl: './company-website-list.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyWebsiteListForm extends FormArrayComponent<Website> {
  makePrimary(index: number): void {
    this.form.controls
      .filter((_, i) => i !== index)
      .forEach((ctrl) => {
        ctrl.patchValue({ IsPrimary: false });
      });
  }

  protected createArrayControl(): FormGroup<Website> {
    return this._fb.group<Website>(
      {
        IsPrimary: [!this.hasPrimaryWebsite()],
        Url: ['', [ValidateUrl]],
        Type: [WebsiteTypeEnum.Corporate],
      },
      { validator: CompanyWebsiteValidator }
    );
  }

  private hasPrimaryWebsite(): boolean {
    return this.groups.some((group) => group.value.IsPrimary);
  }
}

@NgModule({
  declarations: [CompanyWebsiteListForm],
  exports: [CompanyWebsiteListForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosButtonModule,
    CosCheckboxModule,
    CosInputModule,
    CosInputRowModule,
  ],
})
export class CompanyWebsiteListFormModule {}
