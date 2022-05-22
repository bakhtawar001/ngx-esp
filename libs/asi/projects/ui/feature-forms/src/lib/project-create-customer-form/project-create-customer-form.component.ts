import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsiCompanyFormService } from '@asi/company/ui/feature-forms';
import { CompanyFormModel } from '@asi/company/ui/feature-core';
import { ConfirmDialogService } from '@asi/ui/feature-core';
import { CosAddressFormModule } from '@cosmos/components/address-form';
import { CosAutocompleteModule } from '@cosmos/components/autocomplete';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosFormFieldModule, FormStatus } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { FormGroup } from '@cosmos/forms';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CompaniesService } from '@esp/companies';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { EspLookupSelectComponentModule } from '@esp/lookup-types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { AsiCompanyFormComponentModule } from '@asi/company/ui/feature-forms';
import { AsiProjectCreateCustomerFormHeaderDirective } from './project-create-customer-form-header.directive';

@UntilDestroy()
@Component({
  selector: 'asi-project-create-customer-form',
  templateUrl: './project-create-customer-form.component.html',
  styleUrls: ['./project-create-customer-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiProjectCreateCustomerFormComponent implements OnInit {
  @Input()
  data: Partial<CompanyFormModel> = {};

  @Output()
  formStatusChange = new EventEmitter<FormStatus>();
  @Output()
  formValueChange = new EventEmitter<CompanyFormModel>();

  @ViewChild('companyName') companyName!: ElementRef;
  @ViewChild('givenName') givenName!: ElementRef;

  formGroup!: FormGroup<CompanyFormModel>;

  constructor(
    private readonly _companyFormService: AsiCompanyFormService,
    private readonly _companiesService: CompaniesService,
    private readonly _confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.formGroup = this._companyFormService.getCompanyFormGroup(
      this.data.CompanyInformation,
      'Customer',
      this.data.BrandInformation
    );

    this.initFormStatusChanged();
    this.initFormValueChanged();
  }

  private initFormValueChanged(): void {
    this.formGroup.valueChanges
      .pipe(
        filter(() => !this.formGroup.pristine),
        untilDestroyed(this)
      )
      .subscribe((data) => this.formValueChange.emit(data));
  }

  private initFormStatusChanged(): void {
    this.formGroup.statusChanges
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe(() => {
        this.formStatusChange.emit({
          valid: this.formGroup.valid,
          dirty: this.formGroup.dirty,
        });
      });
  }
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CosAutocompleteModule,
    CosButtonModule,
    CosCheckboxModule,
    CosFormFieldModule,
    CosAddressFormModule,
    CosInputModule,
    MatFormFieldModule,
    EspLookupSelectComponentModule,
    AsiCompanyFormComponentModule,
  ],
  declarations: [
    AsiProjectCreateCustomerFormComponent,
    AsiProjectCreateCustomerFormHeaderDirective,
  ],
  exports: [
    AsiProjectCreateCustomerFormComponent,
    AsiProjectCreateCustomerFormHeaderDirective,
  ],
})
export class AsiProjectCreateCustomerFormModule {}
