import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosInputModule } from '@cosmos/components/input';
import { FormGroup, FormGroupComponent } from '@cosmos/forms';
import { HasRolePipeModule } from '@esp/auth';
import { Company } from '@esp/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs/operators';
import { CompanyDetailLocalState } from '../../local-states';

type FormModel = {
  IsCustomer: boolean;
  IsSupplier: boolean;
  IsDecorator: boolean;
};

@UntilDestroy()
@Component({
  selector: 'esp-company-type-row',
  templateUrl: './company-type-row.form.html',
  styleUrls: ['./company-type-row.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyTypeRowForm extends FormGroupComponent<FormModel> {
  constructor(readonly state: CompanyDetailLocalState) {
    super();

    state
      .connect(this)
      .pipe(
        filter((_) => !!_.party),
        map((_) => _.party as Company),
        map(({ IsCustomer, IsSupplier, IsDecorator }) => ({
          IsCustomer,
          IsSupplier,
          IsDecorator,
        })),
        untilDestroyed(this)
      )
      .subscribe((types: FormModel) => {
        this.form?.reset(types);
      });
  }

  get companyTypes() {
    return Object.entries({
      Customer: this.state.party?.['IsCustomer'],
      Supplier: this.state.party?.['IsSupplier'],
      Decorator: this.state.party?.['IsDecorator'],
    })
      .filter(([key, value]) => value)
      .map(([key, value]) => key)
      .join(', ');
  }

  protected override createForm() {
    return this._fb.group<FormModel>(
      {
        IsCustomer: false,
        IsSupplier: false,
        IsDecorator: false,
      },
      {
        validator: this.requireCheckedValidator(1),
      }
    );
  }

  private requireCheckedValidator(minRequired = 1): ValidatorFn {
    return (formGroup: FormGroup<FormModel>): { [key: string]: any } => {
      let checked = 0;
      Object.keys(formGroup.controls).forEach((key) => {
        const control = formGroup.controls[key];

        if (control.value) {
          checked++;
        }
      });

      if (checked < minRequired) {
        return {
          requireCheckboxesToBeChecked: true,
        };
      }

      return null;
    };
  }
}

@NgModule({
  declarations: [CompanyTypeRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    HasRolePipeModule,

    AsiPanelEditableRowModule,

    CosInputModule,

    CosCheckboxModule,
  ],
  exports: [CompanyTypeRowForm],
})
export class CompanyTypeRowFormModule {}
