import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { FormControl, FormControlComponent } from '@cosmos/forms';
import { HasRolePipeModule } from '@esp/auth';
import { MediaLink } from '@esp/models';
import { EspImageUploadFormModule } from '@esp/settings';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { CompanyDetailLocalState } from '../../local-states';

@UntilDestroy()
@Component({
  selector: 'esp-company-favicon-panel-row-form',
  templateUrl: './company-favicon-panel-row.form.html',
  styleUrls: ['./company-favicon-panel-row.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyFaviconPanelRowForm extends FormControlComponent<MediaLink> {
  constructor(readonly state: CompanyDetailLocalState) {
    super();

    state
      .connect(this)
      .pipe(
        map((x) => x.party),
        distinctUntilChanged(isEqual),
        untilDestroyed(this)
      )
      .subscribe((party) => {
        this.control?.reset(party?.IconMediaLink);
      });
  }

  protected override createForm(): FormControl<MediaLink> {
    return this._fb.control({ MediaId: 0 });
  }
}

@NgModule({
  declarations: [CompanyFaviconPanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HasRolePipeModule,

    EspImageUploadFormModule,

    AsiPanelEditableRowModule,
  ],
  exports: [CompanyFaviconPanelRowForm],
})
export class CompanyFaviconPanelRowFormModule {}
