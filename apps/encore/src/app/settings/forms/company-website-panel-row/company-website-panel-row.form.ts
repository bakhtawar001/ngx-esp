import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { ValidateUrl } from '@cosmos/common';
import { CosInputModule } from '@cosmos/components/input';
import { FormControl, FormControlComponent } from '@cosmos/forms';
import { HasRolePipeModule } from '@esp/auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { SettingLocalState } from '../../local-state';

@UntilDestroy()
@Component({
  selector: 'esp-company-website-panel-row-form',
  templateUrl: './company-website-panel-row.form.html',
  styleUrls: ['./company-website-panel-row.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SettingLocalState.forComponent({ settingCode: 'company_profile.website' }),
  ],
})
export class CompanyWebsitePanelRowForm extends FormControlComponent<string> {
  constructor(public readonly state: SettingLocalState) {
    super();

    state
      .connect(this)
      .pipe(
        map((x) => x.value),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe((value) => {
        this.control.reset(value);
      });
  }

  protected override createForm(): FormControl<string> {
    return this._fb.control('', [ValidateUrl]);
  }
}

@NgModule({
  declarations: [CompanyWebsitePanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    HasRolePipeModule,

    CosInputModule,

    AsiPanelEditableRowModule,
  ],
  exports: [CompanyWebsitePanelRowForm],
})
export class CompanyWebsitePanelRowFormModule {}
