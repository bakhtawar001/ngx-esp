import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CosInputModule } from '@cosmos/components/input';
import { FormGroupComponent } from '@cosmos/forms';
import { SocialMediaFormModel, SocialMediaFormPrefix } from '../../models';

const requiredMaxLength = 100;

const inputMaxLength = {
  Facebook: requiredMaxLength - SocialMediaFormPrefix.Facebook.length,
  Instagram: requiredMaxLength - SocialMediaFormPrefix.Instagram.length,
  LinkedIn: requiredMaxLength - SocialMediaFormPrefix.LinkedIn.length,
  Pinterest: requiredMaxLength - SocialMediaFormPrefix.Pinterest.length,
  Twitter: requiredMaxLength - SocialMediaFormPrefix.Twitter.length,
  Other: requiredMaxLength - SocialMediaFormPrefix.Other.length,
};

@Component({
  selector: 'esp-social-media-form',
  templateUrl: './social-media.form.html',
  styleUrls: ['./social-media.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialMediaForm extends FormGroupComponent<SocialMediaFormModel> {
  inputPrefix = SocialMediaFormPrefix;
  inputMaxLength = inputMaxLength;

  override createForm() {
    return this._fb.group<SocialMediaFormModel>({
      Facebook: [''],
      Instagram: [''],
      LinkedIn: [''],
      Pinterest: [''],
      Twitter: [''],
      Other: [''],
    });
  }
}

@NgModule({
  declarations: [SocialMediaForm],
  imports: [CommonModule, ReactiveFormsModule, CosInputModule],
  exports: [SocialMediaForm],
})
export class SocialMediaFormModule {}
