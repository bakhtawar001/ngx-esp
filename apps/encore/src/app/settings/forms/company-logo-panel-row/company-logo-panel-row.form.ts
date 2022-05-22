import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { FormControl, FormControlComponent } from '@cosmos/forms';
import { HasRolePipeModule } from '@esp/auth';
import { EspImageUploadFormModule } from '@esp/settings';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { DesignSettingLocalState } from '../../local-state';

@UntilDestroy()
@Component({
  selector: 'esp-company-logo-panel-row-form',
  templateUrl: './company-logo-panel-row.form.html',
  styleUrls: ['./company-logo-panel-row.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DesignSettingLocalState.forComponent({ settingCode: 'ImageUrl' }),
  ],
})
export class CompanyLogoPanelRowForm extends FormControlComponent<string> {
  constructor(public state: DesignSettingLocalState) {
    super();

    state
      .connect(this)
      .pipe(
        map((x) => x.value),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe((value: string) => {
        this.control.reset(value);
      });
  }

  protected override createForm(): FormControl<string> {
    return this._fb.control('');
  }
}

@NgModule({
  declarations: [CompanyLogoPanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HasRolePipeModule,
    AsiPanelEditableRowModule,
    EspImageUploadFormModule,
  ],
  exports: [CompanyLogoPanelRowForm],
})
export class CompanyLogoPanelRowFormModule {}
