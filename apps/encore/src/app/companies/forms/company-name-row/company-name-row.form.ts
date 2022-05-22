import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosInputModule } from '@cosmos/components/input';
import { FormControlComponent } from '@cosmos/forms';
import { HasRolePipeModule } from '@esp/auth';
import { CompaniesService } from '@esp/companies';
import { ContactsService } from '@esp/contacts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash-es';
import { EMPTY } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { CompanyDetailLocalState } from '../../local-states';

@UntilDestroy()
@Component({
  selector: 'esp-company-name-row',
  templateUrl: './company-name-row.form.html',
  styleUrls: ['./company-name-row.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyNameRowForm
  extends FormControlComponent<string>
  implements OnInit
{
  private originalValue = '';

  constructor(
    private readonly _companiesService: CompaniesService,
    private readonly _contactsService: ContactsService,
    readonly state: CompanyDetailLocalState
  ) {
    super();

    state
      .connect(this)
      .pipe(
        map((_) => _.party),
        distinctUntilChanged(isEqual),
        untilDestroyed(this)
      )
      .subscribe({
        next: (party) => {
          this.originalValue = party?.Name;
          this.control?.reset(party?.Name);
        },
      });
  }

  override ngOnInit() {
    super.ngOnInit();
    this.control.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((value) => !!value),
        switchMap((value) => {
          if (value.trim() === this.originalValue.trim()) {
            return EMPTY;
          }
          return this._companiesService.exists(value);
        }),
        untilDestroyed(this)
      )
      .subscribe({
        next: (exists) => {
          if (exists) {
            this.control.setErrors({ duplicate: true });
          }
        },
      });
  }

  protected override createForm() {
    return this._fb.control<string>('', {
      validators: [Validators.required, Validators.maxLength(50)],
    });
  }
}

@NgModule({
  declarations: [CompanyNameRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    HasRolePipeModule,

    AsiPanelEditableRowModule,

    CosInputModule,
  ],
  exports: [CompanyNameRowForm],
})
export class CompanyNameRowFormModule {}
