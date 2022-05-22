import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosInputModule } from '@cosmos/components/input';
import { FormControl, FormControlComponent } from '@cosmos/forms';
import { HasRolePipeModule } from '@esp/auth';
import { EspBrandColorFormModule } from '@esp/settings';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs/operators';
import { SettingLocalState } from '../../local-state';

export const DEFAULT_COLOR = '#6a7281';

@UntilDestroy()
@Component({
  selector: 'esp-company-brand-color-panel-row-form',
  templateUrl: './company-brand-color-panel-row.form.html',
  styleUrls: ['./company-brand-color-panel-row.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SettingLocalState.forComponent({
      settingCode: 'company_profile.primary_brand_color',
    }),
  ],
})
export class SettingsCompanyBrandColorPanelRowForm extends FormControlComponent<string> {
  defaultColor = DEFAULT_COLOR;

  constructor(public readonly state: SettingLocalState) {
    super();

    state
      .connect(this)
      .pipe(
        map((x) => x.value),
        untilDestroyed(this)
      )
      .subscribe((value) => {
        this.control?.reset(value);
      });
  }

  protected override createForm(): FormControl<string> {
    return this._fb.control<string>(DEFAULT_COLOR, [
      Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
    ]);
  }
}

@NgModule({
  declarations: [SettingsCompanyBrandColorPanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    EspBrandColorFormModule,
    HasRolePipeModule,

    CosInputModule,

    AsiPanelEditableRowModule,
  ],
  exports: [SettingsCompanyBrandColorPanelRowForm],
})
export class SettingsCompanyBrandColorPanelRowFormModule {}
