import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosInputModule } from '@cosmos/components/input';
import { FormControl, FormControlComponent } from '@cosmos/forms';
import { HasRolePipeModule } from '@esp/auth';
import { EspBrandColorFormModule } from '@esp/settings';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { CompanyDetailLocalState } from '../../local-states';

export const DEFAULT_COLOR = '#6A7281';

@UntilDestroy()
@Component({
  selector: 'esp-company-brand-color-panel-row-form',
  templateUrl: './company-brand-color-panel-row.form.html',
  styleUrls: ['./company-brand-color-panel-row.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CompanyDetailLocalState],
})
export class CompanyBrandColorPanelRowForm extends FormControlComponent<string> {
  defaultColor = DEFAULT_COLOR;

  constructor(public readonly state: CompanyDetailLocalState) {
    super();

    state
      .connect(this)
      .pipe(
        map((x) => x.company.PrimaryBrandColor),
        distinctUntilChanged(),
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
  declarations: [CompanyBrandColorPanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    EspBrandColorFormModule,
    HasRolePipeModule,

    CosInputModule,

    AsiPanelEditableRowModule,
  ],
  exports: [CompanyBrandColorPanelRowForm],
})
export class CompanyBrandColorPanelRowFormModule {}
