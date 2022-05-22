import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
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
  selector: 'esp-company-name-panel-row-form',
  styleUrls: ['./company-name-panel-row.form.scss'],
  templateUrl: './company-name-panel-row.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SettingLocalState.forComponent({ settingCode: 'company_profile.name' }),
  ],
})
export class CompanyNamePanelRowForm extends FormControlComponent<string> {
  @Input() isEditable = true;

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
  declarations: [CompanyNamePanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    HasRolePipeModule,

    CosInputModule,

    AsiPanelEditableRowModule,
  ],
  exports: [CompanyNamePanelRowForm],
})
export class CompanyNamePanelRowFormModule {}
