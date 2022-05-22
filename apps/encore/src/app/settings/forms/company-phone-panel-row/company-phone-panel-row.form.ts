import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosInputModule } from '@cosmos/components/input';
import { FormControl, FormControlComponent } from '@cosmos/forms';
import { HasRolePipeModule } from '@esp/auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { SettingLocalState } from '../../local-state';

@UntilDestroy()
@Component({
  selector: 'esp-company-phone-panel-row-form',
  templateUrl: './company-phone-panel-row.form.html',
  styleUrls: ['./company-phone-panel-row.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SettingLocalState.forComponent({ settingCode: 'company_profile.phone' }),
  ],
})
export class CompanyPhonePanelRowForm extends FormControlComponent<string> {
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
    return this._fb.control('', [Validators.required]);
  }
}

@NgModule({
  declarations: [CompanyPhonePanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    HasRolePipeModule,

    CosInputModule,

    AsiPanelEditableRowModule,
  ],
  exports: [CompanyPhonePanelRowForm],
})
export class CompanyPhonePanelRowFormModule {}
